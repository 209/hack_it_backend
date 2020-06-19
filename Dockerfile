FROM node:12-slim

WORKDIR /backend
ENV NODE_ENV development

COPY package.json /backend/package.json

RUN npm install --production

COPY .env /backend/.env
COPY . /backend

CMD ["npm","start"]

EXPOSE 8080
