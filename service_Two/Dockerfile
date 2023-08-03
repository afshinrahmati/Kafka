FROM node:20.4.0-alpine
WORKDIR /app
COPY  package.json index.js /app/
RUN npm i
RUN npm install pm2@latest -g 
CMD [ "pm2","index.js" ]