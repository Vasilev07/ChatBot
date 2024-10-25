# Use an official lightweight Node.js image
FROM node:20-alpine

# Install Chromium and other dependencies
RUN apk update && \
    apk add --no-cache chromium nss freetype freetype-dev harfbuzz ttf-freefont

RUN chromium-browser --version || echo "Chromium not found"

# Set environment variable for puppeteer
ENV PUPPETEER_SKIP_DOWNLOAD true
ENV CHROME_PATH /usr/bin/chromium-browser

# Set the working directory
WORKDIR /app

# Copy project files into the container
COPY . .

# Install Node.js dependencies
RUN npm install

# Command to start your application
CMD ["node", "index.js"]
