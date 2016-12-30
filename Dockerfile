
# Use Ubuntu distribution
FROM node:6.9.2
MAINTAINER Ankit Sardesai <me@ankitsardesai.ca>

# Install necessary packages to install yarn
RUN apt-get update
RUN apt-get install -y apt-transport-https

# Configure apt-get repository for yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# Install yarn and sqlite3
RUN apt-get update
RUN apt-get install -y yarn sqlite3

# Make working directory
RUN mkdir -p /opt/app
WORKDIR /opt/app

# Install packages
ADD package.json yarn.lock ./
RUN yarn

# Copy application code
ADD app ./app
ADD assets ./assets
ADD .eslintrc config.js index.js gulpfile.js ./
ADD webpack.client.js webpack.dev.client.js ./

# Compile codebase
RUN yarn run compile

# Prune developer packages and uncompiled files
RUN rm -rf app
RUN yarn install --production --ignore-scripts --prefer-offline

# Initialize database
RUN mkdir -p /db
ADD database.sql ./
RUN sqlite3 -init ./database.sql /db/ankitsardesai.db ""

# Define environment variables
ENV NODE_ENV production
ENV PORT 5092
ENV DB_URL /db/ankitsardesai.db

# Start the server
CMD ["node", "/opt/app/build/server"]

