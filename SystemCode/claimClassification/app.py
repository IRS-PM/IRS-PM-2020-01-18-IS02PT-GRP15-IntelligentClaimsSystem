from json import JSONDecodeError
from flask import Flask, jsonify, request
from flask_restful import Api, Resource
import requests, json
from classifier import *
from util import *
from config.config import HOST, PORT, CLAIM_REPOSITORY_HOST
import sys
import traceback
import time

app = Flask(__name__)
api = Api(app)
urlhead = CLAIM_REPOSITORY_HOST # "http://192.168.99.100:8081"

isInitialised = False

def classifyNewClaimsOnInit():
    global isInitialised
    if isInitialised:
        return

    isInitialised = True
    print("###################")
    response = None
    maxTries = 3
    tryCount = 0
    while response == None and tryCount < maxTries:
        try:
            tryCount += 1
            print("Getting claims to be classified (try %s)..." % tryCount)
            sys.stdout.flush()
            response = requests.get(urlhead + "/medicalclaim/pendingclassification").json()
        except:
            print("Error getting claims for classification. Could not connect to repository.")
            if tryCount < maxTries:
                print("Retrying in 5 seconds...")
                time.sleep(5)
            else:
                print("Max tries exceeded. Giving up.")
            sys.stdout.flush()
    
    if response == None:
        return

    print("Retrieved claims to be classified")
    claimIds = []
    for claim in response["data"]:
        claimIds.append(str(claim["ClaimNo"]))
        
    print(claimIds)
    sys.stdout.flush()
    processResult = processClaims(claimIds)

# health check
@app.route('/healthcheck', methods=['GET'])
def healthcheck():
    return "ok"

# For testing
@app.route('/classifyclaim', methods=['GET'])
def classifyclaim():
    claimNum = request.args.get('claimno')
    print("Manually classifying %s" % claimNum)
    sys.stdout.flush()
    processResult = processClaims([claimNum])
    return jsonify(processResult)

@app.route('/handle-event', methods=['POST'])
def handleEventReceived():
    print("RECEIVED EVENT IN CLASSIFIER", file=sys.stdout)
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
            sys.stdout.flush()
            return jsonify(processResult)
    except:
        traceback.print_exc()
        print("Error while processing event")
        sys.stdout.flush()
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
    print("Getting claim %s" % claim_num)
    facts = []
    try:
        urlbody = '/medicalclaim/' + claim_num
        claimsdata = requests.get(urlhead + urlbody).json()
        status = claimsdata["Status"]
        if status is not 0:
            return "Status 0"
        else:
            claim_string = getClaimdata(claimsdata)
            if claim_string is not '':
                facts.append(claim_string)

            policy_string = getPolicyDetails(claimsdata)
            if policy_string is not '':
                facts.append(policy_string[0])
            
            doctor_string = getDoctordetails(claimsdata)
            if doctor_string is not '':
                facts.append(doctor_string)

            diagnosis_string = getDiagnosis(claimsdata)
            if diagnosis_string is not '':
                facts.append(diagnosis_string)

            insured_string = getInsuredDetails(claimsdata)
            if insured_string[0] is not '':
                facts.append(insured_string[0])
            if insured_string[1] is not '':
                facts.append(insured_string[1])
            
            items_list = getItemDetails(claimsdata)
            for line in items_list:
                if line is not "":
                    facts.append(line)

            hospital_string = getHospitalDetails(claimsdata)
            if policy_string[1] != "":
                facts.append(policy_string[1])
            if hospital_string != "":
                facts.append(hospital_string)
            
            print("Facts gathered:")
            print(facts)
            runFacts(facts)
            new_fact = getnewFacts()
            return new_fact
    except JSONDecodeError:
        traceback.print_exc()
        print("Invalid data")


def getClaimdata(data):
    try:
        dateofO = data["DateOccFormatted"]
        total = str(data["TotalExp"])
        billcat = data["BillCategory"]
        if json.dumps(data["MainClaimNo"]) == "null":
            main_claim = 0
            datediff = 0
        else:
            main_claim = data["MainClaimNo"]
            try:
                urlbody = '/medicalclaim/' + str(main_claim)
                maindata = requests.get(urlhead + urlbody).json()
                maindateofO =maindata["DateOccFormatted"]
                datediff = getdifference(dateofO, maindateofO)
            except JSONDecodeError:
                traceback.print_exc()
                print("Invalid data")
        new_string = "(Claims(claimtotal " + total + ")(occurance_date " + dateofO + ")(billcategory "+billcat+")(mainclaim "+str(main_claim)+")(duration "+str(datediff)+"))"
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
        r_string = ""
        if balance is None:
            balance = 0
        if rider == "Y":
            routs = str(data["HealthPolicy"]["RiderOutstandingPremium"])
            r_starts = data["HealthPolicy"]["RiderCommencementDateFormatted"]
            r_string = "(Rider(start_date " + r_starts + ")(outstanding " + routs + "))"
        elif rider == "N":
            r_string = ""
        new_string = "(Policy(policy_exp " + exp_date + ")(rider " + rider + ")(policyduration " + duration + ")(policy_balance " + str(balance) + ")(auto_allowed " + auto + "))"
        return new_string, r_string
    except:
        traceback.print_exc()
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
    if ("MedicalPanel" not in data) or (data["MedicalPanel"] is None):
        new_string = "(Doctors(black_list N))"
    else:
        blist = data["MedicalPanel"]["BlacklistReasonID"]
        if blist is None:
            new_string = "(Doctors(black_list N))"
        else:
            new_string = "(Doctors(black_list Y))"
    return new_string


def getDiagnosis(data):
    d_code = data["DiagnosisCode"]
    auto_reject = "N"
    if d_code == "" or d_code is None:
        d_code = "None"
    else:
        try:
            urlbody = f"/diagnosiscode/" + d_code
            d_data = requests.get(urlhead + urlbody).json()
            auto_reject = d_data["AutoReject"]
        except JSONDecodeError as error:
            traceback.print_exc()
            print(error)
    new_string = "(Diagnosis(diagnosis_code " + d_code + ")(autoreject " + auto_reject + "))"
    return new_string


def getInsuredDetails(data):
    policy = data["PolicyNo"]
    outs = str(data["HealthPolicy"]["OutstandingPremium"])
    preillness = data["HealthPolicy"]["PXIllness"]
    autonum = str(data["HealthPolicy"]["CurrentYearAutoClaimCount"])
    st_string = ""
    try:
        urlbody = f"/medicalclaim/policyno/" + policy + "?offset=0&limit=100"
        poldata = requests.get(urlhead + urlbody).json()
        total_claims = poldata["total"]
        pending = 0
        rejected = 0
        for record in range(total_claims):
            if poldata["data"][record]["Status"] is 1:
                pending += 1
            elif poldata["data"][record]["Status"] is 4:
                rejected += 1
        st_string = "(Status(pending "+str(pending)+")(rejected "+str(rejected)+"))"
    except JSONDecodeError as error:
        print(error)
        traceback.print_exc()
        total_claims = 0
        autonum = 0
    new_string = "(Insured(outstanding " + outs + ")(claimsnum_total " + str(total_claims) + ")(autonum " + autonum + ")(pre_illness " + preillness + "))"
    return new_string, st_string


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


classifyNewClaimsOnInit()

if __name__ == "__main__":
    app.run(debug=True, host=HOST, port=PORT)
