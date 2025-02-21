FROM node:16
WORKDIR /app
RUN useradd -m app

COPY verification_api/package*.json ./
RUN npm install

COPY verification_api .
COPY .env .env

USER app
EXPOSE 8081
CMD ["npm", "start"]