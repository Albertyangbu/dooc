FROM node:latest
LABEL description="boge`s Dockerfile for build Docsify."
WORKDIR /docs
RUN npm config set registry https://registry.npm.taobao.org && npm install -g docsify-cli@latest
EXPOSE 3000/tcp
ENTRYPOINT docsify serve .