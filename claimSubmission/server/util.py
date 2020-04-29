import requests
from flask import jsonify
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
from config import CLAIM_REPOSITORY_HOST, OCR_FEATURE, GOOGLE_API_KEY
import json
from google.protobuf import struct_pb2
import base64

def post(url, payload=None):
	size = '%s' % len(payload)
	print("POST '%s' size '%s'", url, size)
	print("Payload: %s", payload)
	resp = requests.post(url, data=payload, headers={'content-type':'application/json'})
	#print("POST response %s: '%s'", resp.status_code, resp.text)
	return (resp.status_code, resp.json())

def submitClaimIntentHandler(param):
	url = "%s/MedicalClaim/" % CLAIM_REPOSITORY_HOST
	#url = "http://127.0.0.1:8081/MedicalClaim"
	payload = json.dumps({
		"PolicyNo" : param["policyno"],
		"DateOcc" : param["dateocc"],
		"CreatedBy" : "claimbot",
		"Specialist" : param["specialist"],
		"SubType" : "FS",
		"BillCategory" : "PP",
		"TotalExp" : param["totalexp"],
		"InsuredID": param["insuredid"],
		"ClaimRemark": param["remark"],
		"AttachUrl": param["url"]
	})
	(status,response) = post(url, payload)
	if status == requests.codes.ok:
		res = "Claim submitted. Reference: %s. This acceptance is subject further assessment.  Additional information may be required for claim approval." % response["ClaimNo"]
	else:
		res = "There is error in the claim submission: %s. Please check and try again with valid information." % response["errors"]
	return res

def uploadEventParameters(url, file, ext):
	parameters = struct_pb2.Struct()
	parameters["attachUrl"] = url
	parameters["originalFileName"] = file.filename
	parameters["ocrResult"] = ""
	if OCR_FEATURE=="1":
		file.seek(0)
		if ext in ['png', 'jpg', 'jpeg', 'gif', 'bmp']:
			parameters["ocrResult"] = imagesAnnotate(file)
		elif ext in ['pdf']:
			parameters["ocrResult"] = filesAnnotate(file)
		else:
			parameters["ocrResult"] = "The file is not supported"
	return parameters

def filesAnnotate(file):
	url = "https://vision.googleapis.com/v1/files:annotate?key=%s" % GOOGLE_API_KEY
	payload = json.dumps({
		"requests": [{
			"inputConfig" : {"content" : (base64.b64encode(file.read())).decode('UTF-8'), "mimeType": "application/pdf"},
			"features" : [{"type": "DOCUMENT_TEXT_DETECTION"}],
			"imageContext" : {"languageHints": ["en-t-i0-handwrit"]}
		}]
	})

	(status,response) = post(url,payload)
	if status == requests.codes.ok:
		text = ''
		for page in response["responses"][0]["responses"]:
			text += page["fullTextAnnotation"]["text"] + "\n"
		return text
	else:
		return "filesAnnotate error %s: %s" % (status, response)

def imagesAnnotate(file):
	url = "https://vision.googleapis.com/v1/images:annotate?key=%s" % GOOGLE_API_KEY
	payload = json.dumps({
		"requests": [{
			"image" : {"content" : (base64.b64encode(file.read())).decode('UTF-8')},
			"features" : [{"type": "DOCUMENT_TEXT_DETECTION"}],
			"imageContext" : {"languageHints": ["en-t-i0-handwrit"]}
		}]
	})
	(status,response) = post(url,payload)
	if status == requests.codes.ok:
		return response["responses"][0]["textAnnotations"][0]["description"]
	else:
		return "imageAnnotate error %s: %s" % (status, response)
