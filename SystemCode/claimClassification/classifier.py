from clips import Environment

env: Environment = Environment()

def runFacts(fact_list):
    env.clear()
    env._load_text('claimconstraints.clp')
    env.reset()
    for fact in fact_list:
        env.assert_string(fact)
    env.run()
def getnewFacts():
    response = ""
    reason = ""
    for fact in env.facts():
        print(fact)
        if '(reason' in str(fact):
            reason = str(fact)
            reason = reason[reason.find("(")+1:-1].split(" ")
            reason = reason[1]
        if '(autoclaim no)' in str(fact):
            response = {"autoclaim": "not allowed", "claimnumber": None, "reason": reason, "record": "updated"}
            break
        elif '(past good)' in str(fact):
            response = {"autoclaim": "allowed", "claimnumber": None, "record": "updated"}
        else:
            response = {"autoclaim": "not allowed", "claimnumber": None, "reason": reason, "record": "updated"}
    if response is "":
        response = {"data": "not fully sent"}
    return response


