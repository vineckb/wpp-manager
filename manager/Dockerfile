FROM node:16.19.1

WORKDIR /app

COPY package*.json ./

RUN apt install git curl
RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build
CMD [ "npm", "run", "start" ]
