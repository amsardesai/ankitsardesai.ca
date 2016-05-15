
FROM debian:jessie
MAINTAINER Ankit Sardesai <me@ankitsardesai.ca>

RUN apt-get update && apt-get install -y sqlite3
RUN mkdir -p /db
ADD database.sql /
RUN sqlite3 -init /database.sql /db/ankitsardesai.db ""

