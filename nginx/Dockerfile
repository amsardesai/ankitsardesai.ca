
FROM nginx:1.10.0
MAINTAINER Ankit Sardesai <me@ankitsardesai.ca>

RUN apt-get install -y openssl
ADD hier /
RUN /scripts/create-certificates.sh

