FROM node:16
WORKDIR /app
RUN useradd -m app

COPY backendWs/package*.json ./
RUN npm install

COPY backendWs .
COPY .env .env

USER app
EXPOSE 3000
CMD ["npm", "start"]