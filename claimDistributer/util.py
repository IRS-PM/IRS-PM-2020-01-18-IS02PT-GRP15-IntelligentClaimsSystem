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
    return response["data"]
    
    # staffs = [
    #     { 'id': 1, 'name': 'Aaa Bbb', 'pool1': 1, 'pool2': 3, 'LastAssigned': {'Date': "2020-05-01", 'AssignedHours': 2, 'AbsentHours': 6} },
    #     { 'id': 2, 'name': 'Baa Cbb', 'pool1': 2, 'pool2': 4, 'LastAssigned': {'Date': "2020-05-02", 'AssignedHours': 2, 'AbsentHours': 6} },
    #     { 'id': 3, 'name': 'Aba Bcb', 'pool1': 3, 'pool2': 2, 'LastAssigned': {'Date': "2020-05-01", 'AssignedHours': 7, 'AbsentHours': 0} },
    #     { 'id': 4, 'name': 'Cde Efd', 'pool1': 4, 'pool2': 1, 'LastAssigned': {'Date': "2020-05-02", 'AssignedHours': 4, 'AbsentHours': 2} },
    #     { 'id': 5, 'name': 'DFaa Bbb', 'pool1': 1, 'pool2': 4, 'LastAssigned': {'Date': "2020-05-02", 'AssignedHours': 5, 'AbsentHours': 0} },
    #     { 'id': 6, 'name': 'Vdaa Cbb', 'pool1': 2, 'pool2': 3, 'LastAssigned': {'Date': "2020-05-02", 'AssignedHours': 1, 'AbsentHours': 3} },
    #     { 'id': 7, 'name': 'Hgba Bcb', 'pool1': 3, 'pool2': 1, 'LastAssigned': {'Date': "2020-05-02", 'AssignedHours': 4, 'AbsentHours': 0} },
    #     { 'id': 8, 'name': 'Klme Efd', 'pool1': 4, 'pool2': 2, 'LastAssigned': {'Date': "2020-05-01", 'AssignedHours': 6, 'AbsentHours': 2} }
    # ]

    # return staffs

def getStaffAvailability(date):
    url = "%s/staff/availability?date=%s" % (CLAIM_REPOSITORY_HOST, date)
    (status,response) = get(url)

    # flatten data
    for idx, staff in enumerate(response["data"]):
        response["data"][idx]["Date"] = staff["TargettedDate"]["Date"]
        response["data"][idx]["AssignedHours"] = staff["TargettedDate"]["AssignedHours"]
        response["data"][idx]["AbsentHours"] = staff["TargettedDate"]["AbsentHours"]
    
    return response["data"]

    # if date == '2020-05-01':
    #     staff_avail = [
    #         { 'staffID': 1, 'Date':'2020-05-01', 'AssignedHours': 2, 'AbsentHours': 6 },
    #         { 'staffID': 2, 'Date':'2020-05-01', 'AssignedHours': 8, 'AbsentHours': 0 },
    #         { 'staffID': 3, 'Date':'2020-05-01', 'AssignedHours': 7, 'AbsentHours': 0 },
    #         { 'staffID': 4, 'Date':'2020-05-01', 'AssignedHours': 5, 'AbsentHours': 3 },
    #         { 'staffID': 5, 'Date':'2020-05-01', 'AssignedHours': 8, 'AbsentHours': 0 },
    #         { 'staffID': 6, 'Date':'2020-05-01', 'AssignedHours': 8, 'AbsentHours': 0 },
    #         { 'staffID': 7, 'Date':'2020-05-01', 'AssignedHours': 8, 'AbsentHours': 0 },
    #         { 'staffID': 8, 'Date':'2020-05-01', 'AssignedHours': 6, 'AbsentHours': 2 }
    #     ]
    # else:
    #     staff_avail = [
    #         { 'staffID': 1, 'Date':'2020-05-02', 'AssignedHours': 0, 'AbsentHours': 0 },
    #         { 'staffID': 2, 'Date':'2020-05-02', 'AssignedHours': 2, 'AbsentHours': 6 },
    #         { 'staffID': 3, 'Date':'2020-05-02', 'AssignedHours': 0, 'AbsentHours': 1 },
    #         { 'staffID': 4, 'Date':'2020-05-02', 'AssignedHours': 4, 'AbsentHours': 2 },
    #         { 'staffID': 5, 'Date':'2020-05-02', 'AssignedHours': 5, 'AbsentHours': 0 },
    #         { 'staffID': 6, 'Date':'2020-05-02', 'AssignedHours': 1, 'AbsentHours': 3 },
    #         { 'staffID': 7, 'Date':'2020-05-02', 'AssignedHours': 4, 'AbsentHours': 0 },
    #         { 'staffID': 8, 'Date':'2020-05-02', 'AssignedHours': 0, 'AbsentHours': 2 }
    #     ]

    # return staff_avail

def getClaims():
    url = "%s/medicalclaim/pendingassignment" % (CLAIM_REPOSITORY_HOST)
    (status,response) = get(url)
    return response["data"]

    # claims = [
    #     { 'ClaimNo': '1000', 'PolicyNo': '1111', 'Status': 0, 'PoolID': 1, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1001', 'PolicyNo': '1112', 'Status': 0, 'PoolID': 2, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1002', 'PolicyNo': '1113', 'Status': 0, 'PoolID': 3, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1003', 'PolicyNo': '1114', 'Status': 0, 'PoolID': 4, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1004', 'PolicyNo': '1115', 'Status': 0, 'PoolID': 1, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1005', 'PolicyNo': '1116', 'Status': 0, 'PoolID': 1, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1006', 'PolicyNo': '1117', 'Status': 0, 'PoolID': 2, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1007', 'PolicyNo': '1118', 'Status': 0, 'PoolID': 2, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1008', 'PolicyNo': '1119', 'Status': 0, 'PoolID': 3, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1009', 'PolicyNo': '1120', 'Status': 0, 'PoolID': 3, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1010', 'PolicyNo': '1121', 'Status': 0, 'PoolID': 4, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1011', 'PolicyNo': '1122', 'Status': 0, 'PoolID': 4, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1012', 'PolicyNo': '1123', 'Status': 0, 'PoolID': 1, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1013', 'PolicyNo': '1124', 'Status': 0, 'PoolID': 2, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1014', 'PolicyNo': '1125', 'Status': 0, 'PoolID': 3, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1015', 'PolicyNo': '1126', 'Status': 0, 'PoolID': 4, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1016', 'PolicyNo': '1127', 'Status': 0, 'PoolID': 1, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1017', 'PolicyNo': '1128', 'Status': 0, 'PoolID': 2, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1018', 'PolicyNo': '1129', 'Status': 0, 'PoolID': 3, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1019', 'PolicyNo': '1130', 'Status': 0, 'PoolID': 4, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1020', 'PolicyNo': '1131', 'Status': 0, 'PoolID': 1, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1021', 'PolicyNo': '1132', 'Status': 0, 'PoolID': 2, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1022', 'PolicyNo': '1133', 'Status': 0, 'PoolID': 3, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1023', 'PolicyNo': '1134', 'Status': 0, 'PoolID': 4, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1024', 'PolicyNo': '1135', 'Status': 0, 'PoolID': 1, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1025', 'PolicyNo': '1136', 'Status': 0, 'PoolID': 2, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1026', 'PolicyNo': '1137', 'Status': 0, 'PoolID': 3, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1027', 'PolicyNo': '1138', 'Status': 0, 'PoolID': 4, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1028', 'PolicyNo': '1139', 'Status': 0, 'PoolID': 1, 'AutoClaim': 0 },
    #     { 'ClaimNo': '1029', 'PolicyNo': '1140', 'Status': 0, 'PoolID': 2, 'AutoClaim': 0 },
    # ]

    # return claims

def assignClaimToStaff(claimNo, staffId, assignedForDate):
    url = "%s/medicalclaim/assign/%s/to/%s" % (CLAIM_REPOSITORY_HOST, claimNo, staffId)
    (status,response) = post(url, json.dumps({
        "AssignedForDate": assignedForDate
    }))

    if status != 200:
        print("Error assigning staff to claim.")
        print(response)

    return status == 200