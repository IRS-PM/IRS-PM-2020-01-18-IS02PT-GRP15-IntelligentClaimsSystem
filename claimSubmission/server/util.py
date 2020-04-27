import requests
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
from config import CLAIM_REPOSITORY_HOST
import json

def post(url, payload=None):
	print("POST '%s' size '%s'", url, len(payload))
	resp = requests.post(url, data=payload, headers={'content-type':'application/json'})
	print("POST response: '%s'", resp.text)
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
		res = "Claim submitted. We will get back to you within 5 working days. Your reference is %s. This acceptance is subject further assessment.  Additional information may be required for claim approval." % response["ClaimNo"]
	else:
		res = "There is error in the claim submission: %s. Please check and try again with valid information." % response["errors"]
	return res