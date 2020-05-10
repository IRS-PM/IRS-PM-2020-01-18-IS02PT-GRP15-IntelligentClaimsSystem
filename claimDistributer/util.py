from flask import jsonify
from config import CLAIM_REPOSITORY_HOST
import json
from datetime import datetime
import requests
import sys

def post(url, payload=None):
	size = '%s' % len(payload)
	print("POST '%s' size '%s'", url, size)
	print("Payload: %s", payload)
	resp = requests.post(url, data=payload, headers={'content-type':'application/json'})
	if (resp != None or resp != '') and resp.status_code == requests.codes.ok:
		return (resp.status_code, resp.json())
	else:
		return (resp.status_code, resp.text)

def patch(url, payload=None):
	size = '%s' % len(payload)
	print("PATCH '%s' size '%s'", url, size)
	print("Payload: %s", payload)
	resp = requests.patch(url, data=payload, headers={'content-type':'application/json'})
	if (resp != None or resp != '') and resp.status_code == requests.codes.ok:
		return (resp.status_code, resp.json())
	else:
		return (resp.status_code, resp.text)

def get(url, params=None):
	resp = requests.get(url, params=params)
	print("url: %s", url)
	print("resp: %s", resp)

	if (resp != None or resp != '') and resp.status_code == requests.codes.ok:
		return (resp.status_code, resp.json())
	else:
		return (resp.status_code, None)
# recentleaveupdates: {
#   date: "5-May-2020", changes: "+2"
# }

def getStaffs():
    url = "%s/staff" % (CLAIM_REPOSITORY_HOST)
    (status,response) = get(url)
    data = response["data"]
    
    def lastAssigned(s):
      if s['LastAssigned'] == {}:
        s['LastAssigned'] = {
          'Date': datetime.today().strftime('%Y-%m-%d'),
          'AssignedHours': 0,
          'AbsentHours': 0
        }
      else:
        s['LastAssigned'] = {
          'Date': s["LastAssigned"]["Date"],
          'AssignedHours': s["LastAssigned"]["AssignedHours"],
          'AbsentHours': min(s["LastAssigned"]["AbsentHours"], 8)
        }
      return s
    
    staffs = map(lastAssigned, data)
    return staffs

def getStaffAvailability(date):
    url = "%s/staff/availability?date=%s" % (CLAIM_REPOSITORY_HOST, date)
    (status,response) = get(url)
    data = response["data"]

    def staffAvail(sa):
      return {
        'staffID': sa["ID"],
        'pool1': sa["Pool1"],
        'pool2': sa["Pool2"],
        'Date': sa["TargettedDate"]["Date"],
        'AssignedHours': sa["TargettedDate"]["AssignedHours"],
        'AbsentHours': min(sa["TargettedDate"]["AbsentHours"], 8)
      }

    staff_avail = map(staffAvail, data)
    return staff_avail

def getClaims():
    url = "%s/medicalclaim/pendingassignment" % (CLAIM_REPOSITORY_HOST)
    (status,response) = get(url)
    data = response["data"]

    def newClaims(c):
      return {
        'ClaimNo': c["ClaimNo"],
        'PolicyNo': c["PolicyNo"],
        'Status': c["Status"],
        'PoolID': c["PoolID"],
        'AutoClaim': c["AutoClaim"]
      }

    claims = map(newClaims, data)
    return claims

def assignClaimToStaff(ca):
    url = "%s/medicalclaim/assignstaff" % (CLAIM_REPOSITORY_HOST)
    (status,response) = post(url, json.dumps({
        "claimAssignment": ca
    }))

    if status != 200:
        print("Error assigning staff to claim.")
        print(response)

    return status == 200