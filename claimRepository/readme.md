# Claims Repository Service

## Endpoints

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
* Note: [status codes: 1=Pending, 2=Approved, 3=Settled, 4=Rejected, 5=Cancelled']

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