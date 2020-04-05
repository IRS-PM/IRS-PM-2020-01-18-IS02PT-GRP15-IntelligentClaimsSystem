# Claims Repository Service

## Setup (Non-Docker)
1. Copy `.env.example` as `.env`
2. Modify contents of `.env` as required
3. Run: `npm install`

## Migrations
To run migrations:
```
npx sequelize-cli db:migrate --config=migrationConfig/config.js   
```

To undo migrations:
```
npx sequelize-cli db:migrate:undo --config=migrationConfig/config.js   
```

## Running
To start server, run:
```
npm start
```