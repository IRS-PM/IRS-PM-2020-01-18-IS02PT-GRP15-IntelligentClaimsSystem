# Claims Management System

## SETUP
1. Install Docker: https://www.docker.com/get-started
2. Install Docker Compose: https://docs.docker.com/compose/install/

## RUN
Run the following command:
```
docker-compose -p icms up --build
```

## DASHBOARD
Dashboard can be accessed here
```
http://127.0.0.1:9001
```

## CHATBOT
Chatbot can be accessed here
```
http://127.0.0.1:5001
```

## CLAIM REPOSITORY
Claim repository can be accessed here
```
http://127.0.0.1:8081
```

## SHUTTING DOWN
Run the following command:
```
docker-compose -p icms down
```

## BUILDING SERVICE IMAGES
Run the following command:
```
docker-compose build <SERVICE NAME>
```