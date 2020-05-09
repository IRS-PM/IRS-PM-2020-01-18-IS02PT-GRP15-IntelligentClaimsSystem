from flask import Flask, jsonify
from util import *
import numpy as np
import pandas as pd
import json
from ortools.linear_solver import pywraplp
import datetime
from config import HOST, PORT
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
  return "hello..."

# POST /distribute
@app.route('/distribute', methods=['GET'])
def distribute():
  claim_assignment = []
  staffs = pd.DataFrame.from_records([x for x in getStaffs()])
  claims = pd.DataFrame.from_records([x for x in getClaims()])
  # return {'staffs': staffs.to_dict(orient='record')}
  num_staffs = staffs.shape[0]
  num_claims = claims.shape[0]
  print("num_claims = ", num_claims)

  b = staffs.iloc[:, 0:4]
  d = pd.DataFrame.from_records([x for x in staffs["LastAssigned"]])
  s = pd.concat([b,d],axis=1,sort=False)
  # return {'staffs': staffs.to_dict(orient='record')}
  s["openslots"] = 8-s["AssignedHours"]-s["AbsentHours"]
  s1 = s[s.AssignedHours+s.AbsentHours != 8].sort_values(by='Date')
  # print(s)
  start_date = s1["Date"].iloc[0] if not s1.empty else s["Date"].iloc[0]
  
  staff_avail = pd.DataFrame.from_records([x for x in getStaffAvailability(start_date)])
  staff_avail["openslots"] = 8-staff_avail["AssignedHours"]-staff_avail["AbsentHours"]
  
  openslots = staff_avail["openslots"].sum()
  c = 0
  # if openslot = 0, then go to next date
  while openslots==0:
    start_date = (datetime.datetime.strptime(start_date, '%Y-%m-%d') + datetime.timedelta(days=1)).strftime('%Y-%m-%d')
    staff_avail = pd.DataFrame.from_records([x for x in getStaffAvailability(start_date)])
    staff_avail["openslots"] = 8-staff_avail["AssignedHours"]-staff_avail["AbsentHours"]
    openslots = staff_avail["openslots"].sum()

  next_date = start_date

  # solver = pywraplp.Solver('SolveAssignmentProblemMIP', pywraplp.Solver.CBC_MIXED_INTEGER_PROGRAMMING)
  n_claims = min(openslots, num_claims)

  while c < num_claims:
    print("openslots = ", openslots)
    print("n_claims = ", n_claims)
    
    # for claim in range(c, c+openslots):
    print(range(c, c+n_claims))

    cost = np.ones((num_staffs,n_claims), dtype=int)
    min_claim = n_claims//num_staffs
    print(min_claim)

    solver = pywraplp.Solver('SolveAssignmentProblemMIP', pywraplp.Solver.CBC_MIXED_INTEGER_PROGRAMMING)

    x = {}
    for i in range(num_staffs):
      for j in range(n_claims):
        x[i, j] = solver.BoolVar('x[%i,%i]' % (i, j))
    # print(x)
    # Objective
    solver.Minimize(solver.Sum([cost[i][j] * x[i,j] for i in range(num_staffs)
                                                for j in range(n_claims)]))

    # Constraints
    # Each worker is assigned claims based on the availability
    for i in range(num_staffs):
        
        if staff_avail.iloc[i].openslots == 0:
          solver.Add(solver.Sum([x[i, j] for j in range(n_claims)]) == 0)
          print('x[%d,%d] == 0' % (i,j))
        else:
          solver.Add(solver.Sum([x[i, j] for j in range(n_claims)]) >= min(min_claim, staff_avail.iloc[i].openslots))
          print('x[%d,%d] >= %d' % (i,j, min(min_claim, staff_avail.iloc[i].openslots)))

          solver.Add(solver.Sum([x[i, j] for j in range(n_claims)]) <= staff_avail.iloc[i].openslots)
          print('x[%d,%d] <= %d' % (i,j, staff_avail.iloc[i].openslots))

    # Each task is assigned to exactly one worker.
    for j in range(n_claims):
      solver.Add(solver.Sum([x[i, j] for i in range(num_staffs)]) == 1)

    print('Number of constraints =', solver.NumConstraints())

    sol = solver.Solve()
    
    print('Total cost = ', solver.Objective().Value())
    print()
    for i in range(num_staffs):
      for j in range(n_claims):
        if x[i, j].solution_value() > 0:
          h = {
            "claimNo": int(claims.iloc[j+c]["ClaimNo"]), 
            "staffId": int(staffs.iloc[i]["ID"]), 
            "assignedForDate": next_date 
          }
          print(h)
          claim_assignment.append(h)
          # print('Staff %d assigned to claim %d.  Cost = %d' % (
          #       i,
          #       j,
          #       cost[i][j]))
    
    c = c+n_claims
    # print("c = ", c)
    next_date = (datetime.datetime.strptime(next_date, '%Y-%m-%d') + datetime.timedelta(days=1)).strftime('%Y-%m-%d')
    # print("next_date = ", next_date)
    staff_avail = pd.DataFrame.from_records([x for x in getStaffAvailability(next_date)])
    staff_avail["openslots"] = 8-staff_avail["AssignedHours"]-staff_avail["AbsentHours"]
    openslots = staff_avail["openslots"].sum()
    # print("openslots = ", openslots)
    
    n_claims = min(openslots, num_claims-c if c+openslots>num_claims else c+openslots)

  res_status = assignClaimToStaff(claim_assignment)
  return json.dumps({'success': res_status})


# -------------------------------------------------------
# distribute with pools
# -------------------------------------------------------

# @app.route('/distributepools', methods=['GET'])
# def distribute():
#   staffs = pd.DataFrame.from_records([x for x in getStaffs()])
#   claims = pd.DataFrame.from_records([x for x in getClaims()])
#   num_staffs = staffs.shape[0]
#   # staff_avail = np.array(getStaffAvailability())
#   num_claims = claims.shape[0]

#   b = staffs.iloc[:, 0:4]
#   d = pd.DataFrame.from_records([x for x in staffs["LastAssigned"]])
#   s = pd.concat([b,d],axis=1,sort=False)
#   s["openslots"] = 8-s["AssignedHours"]-s["AbsentHours"]
#   s = s[s.AssignedHours+s.AbsentHours != 8].sort_values(by='Date')
#   # print(s)
#   start_date = s["date"].iloc[0]

#   staff_avail = pd.DataFrame.from_records([x for x in getStaffAvailability(start_date)])
#   staff_avail["openslots"] = 8-staff_avail["AssignedHours"]-staff_avail["AbsentHours"]

#   openslots = staff_avail["openslots"].sum()
#   c = 0
#   next_date = start_date

#   # solver = pywraplp.Solver('SolveAssignmentProblemMIP', pywraplp.Solver.CBC_MIXED_INTEGER_PROGRAMMING)
#   n_claims = min(openslots, num_claims)

#   while c < num_claims:
#     print("openslots = ", openslots)
#     print("n_claims = ", n_claims)
    
#     # for claim in range(c, c+openslots):
#     print(range(c, c+n_claims))

#     cost = np.ones((num_staffs,n_claims), dtype=int)
#     min_claim = n_claims//num_staffs
#     print(min_claim)

#     solver = pywraplp.Solver('SolveAssignmentProblemMIP', pywraplp.Solver.CBC_MIXED_INTEGER_PROGRAMMING)

#     x = {}
#     for i in range(num_staffs):
#       for j in range(n_claims):
#         x[i, j] = solver.BoolVar('x[%i,%i]' % (i, j))
#     # print(x)
#     # Objective
#     solver.Minimize(solver.Sum([cost[i][j] * x[i,j] for i in range(num_staffs)
#                                                 for j in range(n_claims)]))

#     # Constraints
#     # Each worker is assigned claims based on the availability
#     for i in range(num_staffs):
        
#         if staff_avail.iloc[i].openslots == 0:
#           solver.Add(solver.Sum([x[i, j] for j in range(n_claims)]) == 0)
#           print('x[%d,%d] == 0' % (i,j))
#         else:
#           solver.Add(solver.Sum([x[i, j] for j in range(n_claims)]) >= min(min_claim, staff_avail.iloc[i].openslots))
#           print('x[%d,%d] >= %d' % (i,j, min(min_claim, staff_avail.iloc[i].openslots)))
          
#           solver.Add(solver.Sum([x[i, j] for j in range(n_claims)]) <= staff_avail.iloc[i].openslots)
#           print('x[%d,%d] <= %d' % (i,j, staff_avail.iloc[i].openslots))

#     # Each task is assigned to exactly one worker.
#     for j in range(n_claims):
#       solver.Add(solver.Sum([x[i, j] for i in range(num_staffs)]) == 1)

#     print('Number of constraints =', solver.NumConstraints())

#     sol = solver.Solve()
#     print("status : ", sol == pywraplp.Solver.OPTIMAL)
#     print('Total cost = ', solver.Objective().Value())
#     print()
#     for i in range(num_staffs):
#       for j in range(n_claims):
#         if x[i, j].solution_value() > 0:
#           print('Staff %d assigned to claim %d.  Cost = %d' % (
#                 i,
#                 j,
#                 cost[i][j]))

#     c = c+n_claims
#     print("c = ", c)
#     next_date = (datetime.datetime.strptime(next_date, '%Y-%m-%d') + datetime.timedelta(days=1)).strftime('%Y-%m-%d')
#     print("next_date = ", next_date)
#     staff_avail = pd.DataFrame.from_records([x for x in getStaffAvailability(next_date)])
#     staff_avail["openslots"] = 8-staff_avail["AssignedHours"]-staff_avail["AbsentHours"]
#     openslots = staff_avail["openslots"].sum()
#     # print("openslots = ", openslots)
#     n_claims = min(openslots, num_claims-n_claims)

#   return json.dumps({'staffs': "staffs"})


app.run(debug=True, host=HOST, port=PORT)