# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Build TypeScript
RUN npm run build

# Expose port and start app
EXPOSE 3001
CMD [ "npm", "start" ]