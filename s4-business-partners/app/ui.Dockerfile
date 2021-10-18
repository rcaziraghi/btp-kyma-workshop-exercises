FROM node:10-slim
ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY bp-adm .
RUN npm install
EXPOSE 5000
USER node
CMD [ "node", "./server.js" ]