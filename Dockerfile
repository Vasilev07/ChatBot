# Use an official lightweight Node.js image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy project files into the container
COPY . .

# Install Node.js dependencies
RUN npm install

# Command to start your application
CMD ["node", "index.js"]