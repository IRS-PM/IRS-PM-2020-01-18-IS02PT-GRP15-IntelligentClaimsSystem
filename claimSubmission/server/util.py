import requests
from flask import jsonify
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
from config import CLAIM_REPOSITORY_HOST, OCR_FEATURE, GOOGLE_API_KEY
import json
from google.protobuf import struct_pb2
from datetime import datetime
import base64

def post(url, payload=None):
	size = '%s' % len(payload)
	print("POST '%s' size '%s'", url, size)
	print("Payload: %s", payload)
	resp = requests.post(url, data=payload, headers={'content-type':'application/json'})
	if (resp != None or resp != '') and resp.status_code == requests.codes.ok:
		return (resp.status_code, resp.json())
	else:
		return (resp.status_code, None)

def get(url, params=None):
	resp = requests.get(url, params=params)
	print("url: %s", url)
	print("resp: %s", resp)

	if (resp != None or resp != '') and resp.status_code == requests.codes.ok:
		return (resp.status_code, resp.json())
	else:
		return (resp.status_code, None)

def getPolicyByInsuredID(insuredid):
	url = "%s/HealthPolicy/byinsuredid/%s" % (CLAIM_REPOSITORY_HOST, insuredid)
	(status,response) = get(url)
	return response

def getClaimByPolicyNo(policyno):
	url = "%s/MedicalClaim/policyno/%s" % (CLAIM_REPOSITORY_HOST, policyno)
	(status,response) = get(url)
	return response

def getMainClaimByPolicyNoDateOcc(policyno,dateocc):
	claimno = None
	return next((claim["ClaimNo"] for claim in getClaimByPolicyNo(policyno)["data"] if claim["DateOcc"][0:10] == dateocc[0:10]),None)
	#return [claim["ClaimNo"] for claim in getClaimByPolicyNo(policyno) if (claim["DateOcc"] == dateocc)]
	#return filtered[0]["ClaimNo"] if filtered else None

def submitClaimIntentHandler(param):
	url = "%s/MedicalClaim/" % CLAIM_REPOSITORY_HOST
	#url = "http://127.0.0.1:8081/MedicalClaim"
	#lparam = set(k.lower() for k in param)
	policyno = param.get("PolicyNo", None)
	hospdate = datetime.strptime(param.get("HospitalDate", None)[0:10], '%Y-%m-%d').date()
	dateocc = datetime.strptime(param.get("DateOcc", None)[0:10], '%Y-%m-%d').date()
	currdate = datetime.today().date()
	if dateocc > currdate or hospdate > currdate:
		return "Sorry, we could not file a future claim.  Please try again."
	mainclaimno = param.get("MainClaimNo", getMainClaimByPolicyNoDateOcc(policyno,param.get("HospitalDate", None)))
	payload = json.dumps({
		"PolicyNo" : policyno,
		"MainClaimNo" : mainclaimno,
		"DateOcc" : param.get("DateOcc", None),
		"EffDate" : param.get("EffDate", None),
		"ExpDate" : param.get("ExpDate", None),
		"CreatedBy" : param.get("CreatedBy", "ClaimBot"),
		"Specialist" : param.get("Specialist", ""),
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
		"ProductCode" : param.get("ProductCode", ""),
		"RiderPrdtCode" : param.get("RiderPrdtCode", None),
		"Rider" : param.get("Rider", "N"),
		"PanelTypeID" : "1",
		"ClaimType" : "1",
		"HospitalType" : "V",
		"RefundAmount" : param.get("TotalExp", 0)
	})
	(status,response) = post(url, payload)
	if status == requests.codes.ok:
		res = "Claim submitted. Reference: %s. This acceptance is subject further assessment.  Additional information may be required for claim approval." % response["ClaimNo"]
	else:
		res = "There is error in the claim submission: %s. Please check and try again with valid information." % response["errors"]
	return res


def checkInsuredIntentHandler(param):
	insuredID = param.get("InsuredID", None)
	if len(insuredID) < 7:
		return "Sorry, Please provide a valid ID number"
	policy = getPolicyByInsuredID(insuredID)
	parameters = None
	if policy != None:
		res = "" #"Hi %s, I have verified your ID." % policy["InsuredName"]
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
		res = "The provided ID is not valid"
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
