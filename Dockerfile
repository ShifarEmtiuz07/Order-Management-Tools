# Use Node.js as the base image
FROM node:22-alpine as development

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# # Build the app
# RUN npm run build

# # Expose the port
 EXPOSE 3000

# Start the app
CMD ["npm", "run", "start:dev"]
