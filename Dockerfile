
# Use Ubuntu distribution
FROM node:6.1.0
MAINTAINER Ankit Sardesai <me@ankitsardesai.ca>

# Install packages
ADD package.json npm-shrinkwrap.json /tmp/
RUN cd /tmp && npm install --quiet
RUN mkdir -p /opt/app
RUN cp -a /tmp/node_modules /opt/app/
RUN cp /tmp/package.json /opt/app

# Copy application code
WORKDIR /opt/app
ADD app /opt/app/app
ADD assets /opt/app/assets
ADD .eslintrc config.js index.js gulpfile.js webpack.client.js webpack.dev.client.js /opt/app/

# Compile codebase
RUN npm run compile

# Prune developer packages and uncompiled files
RUN rm -rf app && npm prune --production --quiet

# Define environment variables
ENV NODE_ENV production
ENV PORT 5092
ENV DB_URL /db/ankitsardesai.db

# Start the server
CMD ["node", "/opt/app/build/server"]
