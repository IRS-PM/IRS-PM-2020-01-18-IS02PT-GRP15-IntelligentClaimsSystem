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

def get(url, params=None):
	resp = requests.get(url, params=params)
	return (resp.status_code, resp.json())

def getPolicyByInsuredID(insuredid):
	url = "%s/HealthPolicy/byinsuredid/%s" % (CLAIM_REPOSITORY_HOST, insuredid)
	(status,response) = get(url)
	if status == requests.codes.ok:
		res = response
	else:
		res = None
	return res

def getClaimByPolicyNo(policyno):
	url = "%s/MedicalClaim/policyno/%s" % (CLAIM_REPOSITORY_HOST, policyno)
	(status,response) = get(url)
	if status == requests.codes.ok:
		res = response
	else:
		res = None
	return res

def submitClaimIntentHandler(param):
	url = "%s/MedicalClaim/" % CLAIM_REPOSITORY_HOST
	#url = "http://127.0.0.1:8081/MedicalClaim"
	#lparam = set(k.lower() for k in param)
	payload = json.dumps({
		"PolicyNo" : param.get("PolicyNo", None),
		"MainClaimNo" : param.get("MainClaimNo", None),
		"DateOcc" : param.get("DateOcc", None)
		"CreatedBy" : param.get("CreatedBy", "ClaimBot"),
		"Specialist" : param.get("Specialist", "REG0000731 General Surgery Specialist"),
		"SubType" : param.get("SubType", "FS"),
		"BillCategory" : param.get("BillCategory", "PP"),
		"TotalExp" : param.get("TotalExp", 0),
		"PolicyHolderID": param.get("PolicyHolderID", param.get("InsuredID", None)),
		"PolicyHolderName": param.get("PolicyHolderName", param.get("InsuredName", None)),
		"InsuredID": param.get("InsuredID", None),
		"InsuredName": param.get("InsuredName", None),
		"ClaimRemark": param.get("ClaimRemark", None),
		"AttachUrl": param.get("AttachUrl", None),
		"BenefitCode": param.get("BenefitCode", "PP"),
		"EffDate" : param.get("EffectiveDate", None),
		"ExpDate" : param.get("ExpiryDate", None),
		"ProductCode" : param.get("ProductCode", ""),
		"RiderPrdtCode" : param.get("RiderPrdtCode", None),
		"Rider" : param.get("Rider", "N")
	})
	(status,response) = post(url, payload)
	if status == requests.codes.ok:
		res = "Claim submitted. Reference: %s. This acceptance is subject further assessment.  Additional information may be required for claim approval." % response["ClaimNo"]
	else:
		res = "There is error in the claim submission: %s. Please check and try again with valid information." % response["errors"]
	return res


def validatePoliyIntentHandler(param):
	insuredID = param.get("InsuredID", None)
	if len(insuredID) < 7:
		return "Sorry, Please provide a valid ID number"
	policy = getPolicyByInsuredID(insuredID)
	parameters = None
	if policy != None:
		res = "The insured is %s" % policy["InsuredName"]
		parameters = {
			"InsuredID": policy.get("InsuredID", None),
			"InsuredName": policy.get("InsuredName", None),
			"PolicyHolderID": policy.get("PolicyHolderID", None),
			"PolicyHolderName": policy.get("PolicyHolderName", None),
			"PolicyNo": policy.get("PolicyNo", None),
			"EffDate": policy.get("EffectiveDate", None),
			"ExpDate": policy.get("ExpiryDate", None),
			"ProductCode": policy.get("ProductCode", None),
			"RiderPrdtCode": policy.get("RiderPrdtCode", None),
			"Rider": policy.get("Rider", None)
		}
	else:
		res = "Sorry, We could not find valid policy for the ID provided"
	return (res, parameters)

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
