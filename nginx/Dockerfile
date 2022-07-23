
FROM nginx:1.23.1
MAINTAINER Ankit Sardesai <amsardesai@gmail.com>

RUN apt-get install -y openssl
ADD hier /
RUN /scripts/create-certificates.sh

