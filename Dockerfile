
# Use Ubuntu distribution
FROM node:18.4.0
MAINTAINER Ankit Sardesai <amsardesai@gmail.com>

# Install sqlite3
RUN apt-get update
RUN apt-get install -y sqlite3

# Make working directory
RUN mkdir -p /opt/app
WORKDIR /opt/app

# Install packages
ADD package.json package-lock.json ./
RUN npm install

# Copy application code
ADD app ./app
ADD assets ./assets
ADD .eslintrc.cjs config.js Gulpfile.js ./
ADD webpack.config.js webpack.dev.config.js ./

# Compile codebase
RUN npm run compile-no-lint

# Prune developer packages and uncompiled files
RUN rm -rf app
RUN npm prune --production

# Initialize database
ADD database.sql ./
RUN npm run setup-db

# Define environment variables
ENV NODE_ENV production
ENV PORT 5092

# Start the server
CMD ["node", "/opt/app/build/server"]

