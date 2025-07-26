FROM node:24-alpine

WORKDIR /devtasks/frontend

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3030

CMD [ "npm", "run", "dev" ]