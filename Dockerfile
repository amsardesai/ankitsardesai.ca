
# Use Ubuntu distribution
FROM ubuntu:14.04
MAINTAINER Ankit Sardesai <me@ankitsardesai.ca>

# Install node and sqlite3 on Ubuntu
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
RUN apt-get install -y nodejs sqlite3

# Install packages
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

# Create and populate database
ADD database/database.sql /tmp/database.sql
RUN sqlite3 -init /tmp/database.sql /db/ankitsardesai.db ""

# Copy application code
WORKDIR /opt/app
ADD . /opt/app

# Compile codebase
RUN npm run compile

# Prune developer packages and uncompiled files
RUN rm -rf app
RUN npm prune --production

# Define environment variables
ENV NODE_ENV production
ENV PORT 5092
ENV DB_URL /db/ankitsardesai.db

# Expose the port being used
EXPOSE 5092

# Start the server
CMD ["node", "build/server.js"]

