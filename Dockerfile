# Use Node.js as the base image
FROM node:22-alpine 

# Set the working directory
WORKDIR /app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 8080

# Start the app
CMD ["npm", "run", "start:dev"]