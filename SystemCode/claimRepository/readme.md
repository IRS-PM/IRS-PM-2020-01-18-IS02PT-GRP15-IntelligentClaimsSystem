# Claims Repository Service

## Endpoints

### Settings
Get
```
Method: get
Endpoint: /settings
```

Update
```
Method: patch
Endpoint: /settings
Headers: {
    Content-Type: application/json
}
Body: {
    "LastSchedulerRunTime": "2020-05-07T01:00:00.000Z",
    ...
}
```

### Staff
Get all
```
Method: get
Endpoint: /staff?offset=0&limit=100
```

Get one
```
Method: get
Endpoint: /staff/:id
```

Get all staff or 1 staff, with availability details
```
Method: get
Endpoint: /staff/availability?date=2020-05-01&staffId=1
```

Get leave schedule that is updated after a certain time
```
Method: get
Endpoint: /staff/leaveschedule?updatedAfter=2020-04-30
```


### Product Plans
Get all
```
Method: get
Endpoint: /productplan?offset=0&limit=100
```

Get one
```
Method: get
Endpoint: /productplan/:productCode
```

### Hospital
Get all
```
Method: get
Endpoint: /hospital?offset=0&limit=100
```

Get one
```
Method: get
Endpoint: /hospital/:hospitalCode
```

### Medical Panels
Get all
```
Method: get
Endpoint: /medicalpanel?offset=0&limit=100
```

Get one
```
Method: get
Endpoint: /medicalpanel/:panelID
```

### DiagnosisCode
Get all
```
Method: get
Endpoint: /diagnosiscode?offset=0&limit=100
```

Get by auto reject flag
```
Method: get
Endpoint: /diagnosiscode/autoreject/:autoReject?offset=0&limit=100
```
* note: autoReject can be `Y` or `N`
  
Get by minor claims flag
```
Method: get
Endpoint: /diagnosiscode/minorclaims/:minorClaims?offset=0&limit=100
```
* note: minorClaims can be `Y` or `N`

Get one
```
Method: get
Endpoint: /diagnosiscode/:code
```

### Health Policies
Get all
```
Method: get
Endpoint: /healthpolicy?offset=0&limit=100
```

Get one
```
Method: get
Endpoint: /healthpolicy/:policyNo
```

Get by insured id
```
Method: get
Endpoint: /healthpolicy/byinsuredid/:insuredID
```

### Medical claims
Get all
```
Method: get
Endpoint: /medicalclaim?offset=0&limit=100
```

Get by status
```
Method: get
Endpoint: /medicalclaim/status/:status?offset=0&limit=100
```
* Note: [status codes: 0=New, 1=Pending, 2=Approved, 3=Settled, 4=Rejected, 5=Cancelled']

Get by policyno
```
Method: get
Endpoint: /medicalclaim/policyno/:policyno?offset=0&limit=100
```

Get one
```
Method: get
Endpoint: /medicalclaim/:claimNo
```

Create
```
Method: post
Endpoint: /medicalclaim
Headers: {
    Content-Type: application/json
}
Body: {
    "PolicyNo": "xxx",
    ...
}
```

Update
```
Method: patch
Endpoint: /medicalclaim/:claimNo
Headers: {
    Content-Type: application/json
}
Body: {
    "PolicyNo": "xxx",
    ...
}
```

Assign a staff to claim
```
Method: put
Endpoint: /assign/:claimNo/to/:staffID
```


## Setup (Non-Docker)
1. Copy `.env.example` as `.env`
2. Modify contents of `.env` as required
3. Run: `npm install`

### Migrations
To run migrations:
```
npx sequelize-cli db:migrate --config=migrationConfig/config.js   
```

To undo migrations:
```
npx sequelize-cli db:migrate:undo --config=migrationConfig/config.js   
```

To run seeders:
```
npx sequelize-cli db:seed --config=migrationConfig/config.js --seed {SEED_NAME}
```

To undo seeders:
```
npx sequelize-cli db:seed:undo --config=migrationConfig/config.js --seed {SEED_NAME}
```

### Running
To start server, run:
```
npm start
```