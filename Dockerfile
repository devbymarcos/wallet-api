
FROM node:20-alpine3.20

WORKDIR /usr/app
COPY package*.json ./
RUN npm install
RUN npm install -g typescript tsx
COPY . .
EXPOSE 3000
CMD [ "npm","dev" ]
