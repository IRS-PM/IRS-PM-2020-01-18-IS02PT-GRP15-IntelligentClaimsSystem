# USE official node as base
FROM node:13.12.0-alpine

# Set the working directory to /app
WORKDIR /app

# npm install in temp folder
COPY ./package.json /tmp/package.json
RUN cd /tmp && npm install --verbose

# Copy the current directory contents into the container at /app
COPY ./ /app

# copy node_modules from /tmp
RUN cp -Rf /tmp/* /app
RUN cd /app

# run
CMD npx sequelize-cli db:migrate --config=migrationConfig/config.js && npx sequelize-cli db:seed --config=migrationConfig/config.js --seed 20200426162236-healthPoliciesSeeder.js && npm run start