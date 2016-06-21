FROM node:6.2.2-onbuild
MAINTAINER Nathaniel Blackburn

RUN npm run build
