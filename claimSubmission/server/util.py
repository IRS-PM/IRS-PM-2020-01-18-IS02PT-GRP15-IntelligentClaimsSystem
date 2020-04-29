import requests
from flask import jsonify
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
from config import CLAIM_REPOSITORY_HOST, OCR_FEATURE
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
	if 1==1: #OCR_FEATURE=="TRUE":
		file.seek(0)
		if ext in ['png', 'jpg', 'jpeg', 'gif', 'bmp']:
			url='https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBuZXEcDehWONb3Np0axuAj0jg8l9K00pw'
			payload = json.dumps(get_vision_image_request(file))
		elif ext in ['pdf']:
			url='https://vision.googleapis.com/v1/files:annotate?key=AIzaSyBuZXEcDehWONb3Np0axuAj0jg8l9K00pw'
			payload = json.dumps(get_vision_pdf_request(file))
		else:
			return "The file is not supported"
		(status,response) = post(url,payload)
		if status == requests.codes.ok:
			text = ''
			for page in response["responses"][0]["responses"]:
				text += page["fullTextAnnotation"]["text"] + "\n"
			parameters["ocrResult"] = text
		else:
			parameters["ocrResult"] = "OCR error %s: %s" % (status, response)
	return parameters

def get_vision_pdf_request(file):
	return {
		"requests": [{
			"inputConfig" : {"content" : (base64.b64encode(file.read())).decode('UTF-8'), "mimeType": "application/pdf"},
			"features" : [{"type": "DOCUMENT_TEXT_DETECTION"}],
			"imageContext" : {"languageHints": ["en-t-i0-handwrit"]}
		}]
	}

def get_vision_image_request(file):
	return {
		"requests": [{
			"image" : {"content" : (base64.b64encode(file.read())).decode('UTF-8')},
			"features" : [{"type": "DOCUMENT_TEXT_DETECTION"}],
			"imageContext" : {"languageHints": ["en-t-i0-handwrit"]}
		}]
	}