
# Use Ubuntu distribution
FROM ubuntu:14.04
MAINTAINER Ankit Sardesai <me@ankitsardesai.ca>

# Install node and sqlite3 on Ubuntu
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
RUN apt-get install -y nodejs sqlite3 nginx supervisor openssl

# Install packages
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

# Copy application code
WORKDIR /opt/app
ADD . /opt/app

# # Compile codebase
RUN npm run compile

# # Prune developer packages and uncompiled files
RUN rm -rf app && npm prune --production

# Add hier directories to root
ADD hier /

# Create and populate database
RUN sqlite3 -init /db/database.sql /db/ankitsardesai.db ""

# Create self-signed certs
# RUN /scripts/create-certificates.sh

# Add nginx user and start it
RUN useradd -ms /bin/bash nginx && /etc/init.d/nginx start

# Define environment variables
ENV NODE_ENV production
ENV PORT 5092
ENV DB_URL /db/ankitsardesai.db

# Expose the port being used
EXPOSE 80
EXPOSE 443

# Start the server
CMD ["/usr/bin/supervisord"]

