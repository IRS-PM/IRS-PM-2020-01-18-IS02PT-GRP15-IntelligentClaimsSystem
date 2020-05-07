from json import JSONDecodeError
from flask import Flask, jsonify, request
from flask_restful import Api, Resource
import requests, json
from classifier import *
from util import *
from config.config import HOST, PORT, CLAIM_REPOSITORY_HOST
import sys

app = Flask(__name__)
api = Api(app)
urlhead = CLAIM_REPOSITORY_HOST # "http://192.168.99.100:8081"



@app.route('/handle-event', methods=['POST'])
def handleEventReceived():
    print("RECEIVED EVENT IN CLASSIFIER")
    claimIds = []
    try:
        dataPayload = json.loads(request.data.decode(encoding="utf-8"))
        print(dataPayload)
        event = dataPayload['event']
        data = json.loads(dataPayload['body'])
        if (event == "NEW_CLAIM_SUBMITTED"):
            print(data)
            claimIds = data["claimIds"]
            processResult = processClaims(map(str, claimIds))
            return jsonify(processResult)
    except:
        print(sys.exc_info()[0])
        print("Error while processing event")
        return "Error processing event"



def processClaims(claimlist):
    print("Processing ", claimlist)
    claim_results = []
    for claim_num in claimlist:
        new_fact = getall(claim_num)
        if new_fact == "Status 0":
            print(claim_num+" is not a newly submitted claim")
            continue
        elif new_fact is None:
            print("No results for claimnumber "+claim_num)
            continue
        else:
            new_fact["claimnumber"] = claim_num
            urlbody = '/medicalclaim/' + new_fact["claimnumber"]
            if str(new_fact["autoclaim"]) == "allowed":
                update = {"Status": 2, "AutoClaim": True}
                r = requests.patch(
                                    url=urlhead+urlbody,
                                    data=json.dumps(update),
                                    headers={'Content-Type': 'application/json'})
                print(r.text)
            elif str(new_fact["autoclaim"]) == "not allowed":
                update = {"ClassificationReason": new_fact["reason"], "AutoClaim": False}
                r = requests.patch(
                                    url=urlhead+urlbody,
                                    data=json.dumps(update),
                                    headers={'Content-Type': 'application/json'})
                print(r.text)
            claim_results.append(new_fact)

    return claim_results
        


def getall(claim_num):
    facts = []
    try:
        urlbody = '/medicalclaim/' + claim_num
        claimsdata = requests.get(urlhead + urlbody).json()
        status = claimsdata["Status"]
        if status is not 0:
            return "Status 0"
        status_response = getstatuslist(claimsdata)
        if 'autoclaim' in status_response:
            return status_response
        else:
            claim_string = getClaimdata(claimsdata)
            facts.append(claim_string)
            policy_string = getPolicyDetails(claimsdata)
            facts.append(policy_string[0])
            doctor_string = getDoctordetails(claimsdata)
            facts.append(doctor_string)
            diagnosis_string = getDiagnosis(claimsdata)
            facts.append(diagnosis_string)
            insured_string = getInsuredDetails(claimsdata)
            facts.append(insured_string)
            items_list = getItemDetails(claimsdata)
            for line in items_list:
                facts.append(line)
            hospital_string = getHospitalDetails(claimsdata)
            if policy_string[1] != "":
                facts.append(policy_string[1])
            if hospital_string != "":
                facts.append(hospital_string)
            runFacts(facts)
            new_fact = getnewFacts()
            return new_fact
    except JSONDecodeError:
        print("Invalid data")


def getClaimdata(data):
    try:
        dateofO = data["DateOccFormatted"]
        total = str(data["TotalExp"])
        new_string = "(Claims(claimtotal " + total + ")(occurance_date " + dateofO + "))"
        return new_string
    except:
        print("Medicalclaims records not proper")

def getPolicyDetails(data):
    try:
        exp_date = data["HealthPolicy"]["ExpiryDateFormatted"]
        rider = data["HealthPolicy"]["Rider"]
        duration = str(getduration(data["HealthPolicy"]["CommencementDateFormatted"]))
        balance = (data["HealthPolicy"]["PolicyYearBalance"])
        auto = data["HealthPolicy"]['AllowAutoClaim']
        pstatus = str(data["HealthPolicy"]["Status"])
        r_string = ""
        if balance is None:
            balance = 0
        if rider == "Y":
            routs = str(data["HealthPolicy"]["RiderOutstandingPremium"])
            r_starts = data["HealthPolicy"]["RiderCommencementDateFormatted"]
            r_string = "(Rider(start_date " + r_starts + ")(outstanding " + routs + "))"
        elif rider == "N":
            r_string = ""
        new_string = "(Policy(policy_exp " + exp_date + ")(rider " + rider + ")(status "+pstatus+")(policyduration " + duration + ")(policy_balance " + str(balance) + ")(auto_allowed " + auto + "))"
        return new_string, r_string
    except:
        print("Policy records are not proper")

def getHospitalDetails(data):
    hosp_type = data["HospitalType"]
    if hosp_type == "":
        new_string = ""
    else:
        new_string = "(Hospital(type " + hosp_type + "))"
    return new_string


def getDoctordetails(data):
    id = data["Specialist"]
    new_string = ""
    if id == "":
        new_string = "(Doctors(black_list N))"
    else:
        blist = data["MedicalPanel"]["BlacklistReasonID"]
        if blist is None:
            new_string = "(Doctors(black_list N))"
        elif blist is 1:
            new_string = "(Doctors(black_list Y))"
    return new_string


def getDiagnosis(data):
    d_code = data["DiagnosisCode"]
    auto_reject = "N"
    if d_code == "":
        d_code = "None"
    else:
        try:
            urlbody = f"/diagnosiscode/" + d_code
            d_data = requests.get(urlhead + urlbody).json()
            auto_reject = d_data["AutoReject"]
        except JSONDecodeError as error:
            print(error)
    new_string = "(Diagnosis(diagnosis_code " + d_code + ")(autoreject " + auto_reject + "))"
    return new_string


def getInsuredDetails(data):
    policy = data["PolicyNo"]
    outs = str(data["HealthPolicy"]["OutstandingPremium"])
    preillness = data["HealthPolicy"]["PXIllness"]
    autonum = str(data["HealthPolicy"]["CurrentYearAutoClaimCount"])
    try:
        urlbody = f"/medicalclaim/policyno/" + policy + "?offset=0&limit=100"
        poldata = requests.get(urlhead + urlbody).json()
        total_claims = str(poldata["total"])

    except JSONDecodeError as error:
        print(error)
        total_claims = "0"
        autonum = "0"
    new_string = "(Insured(outstanding " + outs + ")(claimsnum_total " + total_claims + ")(autonum " + autonum + ")(pre_illness " + preillness + "))"
    return new_string


def getItemDetails(data):
    claimitems = data["ClaimItems"]
    itemlist = []
    count = len(claimitems)
    for item in range(count):
        bcode = claimitems[item]["BenefitCode"]
        amount = str(claimitems[item]["Amount"])
        blimit = str(claimitems[item]["PolicyBenefit"]["BenefitLimit"])
        itemstring = "(Claimproducts(pcode " + bcode + ")(amount " + amount + ")(limit " + blimit + "))"
        itemlist.append(itemstring)

    itemlist = list(dict.fromkeys(itemlist))
    return itemlist


def getstatuslist(data):
    policy = data["PolicyNo"]
    urlbody = f"/medicalclaim/policyno/" + policy + "?offset=0&limit=100"
    poldata = requests.get(urlhead + urlbody).json()
    totalnum = poldata["total"]
    pending = 0
    rejected = 0
    for record in range(totalnum):
        if poldata["data"][record]["Status"] is 1:
            pending += 1
        elif poldata["data"][record]["Status"] is 4:
            rejected += 1

    if pending >= 1 | rejected >= 1:
        new_string = {"autoclaim": "not allowed", "claimnumber": None, "reason": "Pending or rejected claims", "record": "updated"}
    else:
        new_string = ""
    return new_string


# api.add_resource(Information, "/")

if __name__ == "__main__":
    app.run(debug=True, host=HOST, port=PORT)
