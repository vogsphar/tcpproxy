FROM node:10

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]