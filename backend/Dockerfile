FROM node:16
WORKDIR /app
RUN useradd -m app

COPY backend/package*.json ./
RUN npm install

COPY backend .

USER app
EXPOSE 8080
CMD ["npm", "start"]