# import requests
from flask import jsonify
from config import CLAIM_REPOSITORY_HOST
import json
from datetime import datetime

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
# recentleaveupdates: {
#   date: "5-May-2020", changes: "+2"
# }

def getStaffs():
    # url = "%s/HealthPolicy/byinsuredid/%s" % (CLAIM_REPOSITORY_HOST, insuredid)
    # (status,response) = get(url)
    staffs = [
        { 'id': 1, 'name': 'Aaa Bbb', 'pool1': 1, 'pool2': 3, 'lastAssignedOn': {'date': "2020-05-01", 'assignedHrs': 2, 'absentHrs': 6} },
        { 'id': 2, 'name': 'Baa Cbb', 'pool1': 2, 'pool2': 4, 'lastAssignedOn': {'date': "2020-05-02", 'assignedHrs': 2, 'absentHrs': 6} },
        { 'id': 3, 'name': 'Aba Bcb', 'pool1': 3, 'pool2': 2, 'lastAssignedOn': {'date': "2020-05-01", 'assignedHrs': 7, 'absentHrs': 0} },
        { 'id': 4, 'name': 'Cde Efd', 'pool1': 4, 'pool2': 1, 'lastAssignedOn': {'date': "2020-05-02", 'assignedHrs': 4, 'absentHrs': 2} },
        { 'id': 5, 'name': 'DFaa Bbb', 'pool1': 1, 'pool2': 4, 'lastAssignedOn': {'date': "2020-05-02", 'assignedHrs': 5, 'absentHrs': 0} },
        { 'id': 6, 'name': 'Vdaa Cbb', 'pool1': 2, 'pool2': 3, 'lastAssignedOn': {'date': "2020-05-02", 'assignedHrs': 1, 'absentHrs': 3} },
        { 'id': 7, 'name': 'Hgba Bcb', 'pool1': 3, 'pool2': 1, 'lastAssignedOn': {'date': "2020-05-02", 'assignedHrs': 4, 'absentHrs': 0} },
        { 'id': 8, 'name': 'Klme Efd', 'pool1': 4, 'pool2': 2, 'lastAssignedOn': {'date': "2020-05-01", 'assignedHrs': 6, 'absentHrs': 2} }
    ]

    return staffs

def getStaffAvailability(date):
    if date == '2020-05-01':
        staff_avail = [
            { 'staffID': 1, 'date':'2020-05-01', 'assignedHrs': 2, 'absentHrs': 6 },
            { 'staffID': 2, 'date':'2020-05-01', 'assignedHrs': 8, 'absentHrs': 0 },
            { 'staffID': 3, 'date':'2020-05-01', 'assignedHrs': 7, 'absentHrs': 0 },
            { 'staffID': 4, 'date':'2020-05-01', 'assignedHrs': 5, 'absentHrs': 3 },
            { 'staffID': 5, 'date':'2020-05-01', 'assignedHrs': 8, 'absentHrs': 0 },
            { 'staffID': 6, 'date':'2020-05-01', 'assignedHrs': 8, 'absentHrs': 0 },
            { 'staffID': 7, 'date':'2020-05-01', 'assignedHrs': 8, 'absentHrs': 0 },
            { 'staffID': 8, 'date':'2020-05-01', 'assignedHrs': 6, 'absentHrs': 2 }
        ]
    else:
        staff_avail = [
            { 'staffID': 1, 'date':'2020-05-02', 'assignedHrs': 0, 'absentHrs': 0 },
            { 'staffID': 2, 'date':'2020-05-02', 'assignedHrs': 2, 'absentHrs': 6 },
            { 'staffID': 3, 'date':'2020-05-02', 'assignedHrs': 0, 'absentHrs': 1 },
            { 'staffID': 4, 'date':'2020-05-02', 'assignedHrs': 4, 'absentHrs': 2 },
            { 'staffID': 5, 'date':'2020-05-02', 'assignedHrs': 5, 'absentHrs': 0 },
            { 'staffID': 6, 'date':'2020-05-02', 'assignedHrs': 1, 'absentHrs': 3 },
            { 'staffID': 7, 'date':'2020-05-02', 'assignedHrs': 4, 'absentHrs': 0 },
            { 'staffID': 8, 'date':'2020-05-02', 'assignedHrs': 0, 'absentHrs': 2 }
        ]

    return staff_avail

def getClaims():
    claims = [
        { 'ClaimNo': '1000', 'PolicyNo': '1111', 'Status': 0, 'PoolID': 1, 'AutoClaim': 0 },
        { 'ClaimNo': '1001', 'PolicyNo': '1112', 'Status': 0, 'PoolID': 2, 'AutoClaim': 0 },
        { 'ClaimNo': '1002', 'PolicyNo': '1113', 'Status': 0, 'PoolID': 3, 'AutoClaim': 0 },
        { 'ClaimNo': '1003', 'PolicyNo': '1114', 'Status': 0, 'PoolID': 4, 'AutoClaim': 0 },
        { 'ClaimNo': '1004', 'PolicyNo': '1115', 'Status': 0, 'PoolID': 1, 'AutoClaim': 0 },
        { 'ClaimNo': '1005', 'PolicyNo': '1116', 'Status': 0, 'PoolID': 1, 'AutoClaim': 0 },
        { 'ClaimNo': '1006', 'PolicyNo': '1117', 'Status': 0, 'PoolID': 2, 'AutoClaim': 0 },
        { 'ClaimNo': '1007', 'PolicyNo': '1118', 'Status': 0, 'PoolID': 2, 'AutoClaim': 0 },
        { 'ClaimNo': '1008', 'PolicyNo': '1119', 'Status': 0, 'PoolID': 3, 'AutoClaim': 0 },
        { 'ClaimNo': '1009', 'PolicyNo': '1120', 'Status': 0, 'PoolID': 3, 'AutoClaim': 0 },
        { 'ClaimNo': '1010', 'PolicyNo': '1121', 'Status': 0, 'PoolID': 4, 'AutoClaim': 0 },
        { 'ClaimNo': '1011', 'PolicyNo': '1122', 'Status': 0, 'PoolID': 4, 'AutoClaim': 0 },
        { 'ClaimNo': '1012', 'PolicyNo': '1123', 'Status': 0, 'PoolID': 1, 'AutoClaim': 0 },
        { 'ClaimNo': '1013', 'PolicyNo': '1124', 'Status': 0, 'PoolID': 2, 'AutoClaim': 0 },
        { 'ClaimNo': '1014', 'PolicyNo': '1125', 'Status': 0, 'PoolID': 3, 'AutoClaim': 0 },
        { 'ClaimNo': '1015', 'PolicyNo': '1126', 'Status': 0, 'PoolID': 4, 'AutoClaim': 0 },
        { 'ClaimNo': '1016', 'PolicyNo': '1127', 'Status': 0, 'PoolID': 1, 'AutoClaim': 0 },
        { 'ClaimNo': '1017', 'PolicyNo': '1128', 'Status': 0, 'PoolID': 2, 'AutoClaim': 0 },
        { 'ClaimNo': '1018', 'PolicyNo': '1129', 'Status': 0, 'PoolID': 3, 'AutoClaim': 0 },
        { 'ClaimNo': '1019', 'PolicyNo': '1130', 'Status': 0, 'PoolID': 4, 'AutoClaim': 0 },
        { 'ClaimNo': '1020', 'PolicyNo': '1131', 'Status': 0, 'PoolID': 1, 'AutoClaim': 0 },
        { 'ClaimNo': '1021', 'PolicyNo': '1132', 'Status': 0, 'PoolID': 2, 'AutoClaim': 0 },
        { 'ClaimNo': '1022', 'PolicyNo': '1133', 'Status': 0, 'PoolID': 3, 'AutoClaim': 0 },
        { 'ClaimNo': '1023', 'PolicyNo': '1134', 'Status': 0, 'PoolID': 4, 'AutoClaim': 0 },
        { 'ClaimNo': '1024', 'PolicyNo': '1135', 'Status': 0, 'PoolID': 1, 'AutoClaim': 0 },
        { 'ClaimNo': '1025', 'PolicyNo': '1136', 'Status': 0, 'PoolID': 2, 'AutoClaim': 0 },
        { 'ClaimNo': '1026', 'PolicyNo': '1137', 'Status': 0, 'PoolID': 3, 'AutoClaim': 0 },
        { 'ClaimNo': '1027', 'PolicyNo': '1138', 'Status': 0, 'PoolID': 4, 'AutoClaim': 0 },
        { 'ClaimNo': '1028', 'PolicyNo': '1139', 'Status': 0, 'PoolID': 1, 'AutoClaim': 0 },
        { 'ClaimNo': '1029', 'PolicyNo': '1140', 'Status': 0, 'PoolID': 2, 'AutoClaim': 0 },
    ]

    return claims