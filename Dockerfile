# Use an official lightweight Node.js image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR .

# Copy project files into the container
COPY . .

# Install Node.js dependencies
RUN echo ls -la

RUN npm install

RUN apt-get install -y wget
RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install -y ./google-chrome-stable_current_amd64.deb

# Command to start your application
CMD ["node", "index.js"]