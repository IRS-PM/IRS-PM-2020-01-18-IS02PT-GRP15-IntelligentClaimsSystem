# Claims Repository Service

## Endpoints

### Health Policies
Get all
```
Method: get
Endpoint: /healthpolicy?offset=0&limit=100
```

Get one
```
Method: get
Endpoint: /healthpolicy/:policyno
```

### Medical claims
Get all
```
Method: get
Endpoint: /medicalclaim?offset=0&limit=100
```

**Get by classification status**
```
Method: get
Endpoint: /medicalclaim/classificationstatus/:status?offset=0&limit=100
```
* Note: Valid statuses are: `pending`, `approved`, `rejected`, `human_intervention`

Get one
```
Method: get
Endpoint: /medicalclaim/:claimno
```

Create
```
Method: post
Endpoint: /medicalclaim
Body: {
    "PolicyNo": "xxx",
    ...
}
```

Update
```
Method: patch
Endpoint: /medicalclaim/:claimno
Body: {
    "PolicyNo": "xxx",
    ...
}
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