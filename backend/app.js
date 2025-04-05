const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connect = require('./configs/database');
const winston = require('winston');
require('winston-daily-rotate-file'); // Импортируем ротацию файлов

dotenv.config({ path: "./.env" });

const authRoutes = require('./routes/authRoutes');
const registerRoutes = require('./routes/registerRoutes');
const mainRoutes = require('./routes/mainRoutes');
const accountRoutes = require('./routes/accountRoutes');

const app = express();
const PORT = process.env.PORT;

// Настройка логера с ротацией файлов
const logTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/server-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d' // Хранить логи за последние 30 дней
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    logTransport
  ],
});

app.use(express.json());

// Логирование каждого запроса
app.use((req, res, next) => {
  logger.info(`📩 Пришел запрос: ${req.method} ${req.originalUrl}`);
  next(); // Передаем управление следующему middleware
});

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/main', mainRoutes);
app.use('/api/account', accountRoutes);

// Обработчик ошибок
app.use((err, req, res, next) => {
  if (err) {
    logger.error(`❌ Ошибка: ${err.message} | Статус: ${err.status || 500}`);
    res.status(err.status || 500).send(err.message);
  }
  next(); // Передаем ошибку дальше
});

// Подключение к MongoDB
mongoose.connect(process.env.BD_MONGO_URI)
  .then(() => {
    console.log('✅ Подключено к MongoDB');

    // Запуск сервера после успешного подключения к БД
    app.listen(PORT, () => {
      console.log(`🚀 Сервер работает на порту ${PORT}`);

      connect.sync()
        .then(() => console.log('📄 Таблицы успешно синхронизированы!'))
        .catch((err) => console.error('❌ Ошибка синхронизации таблиц: ', err));
    });
  })
  .catch((error) => {
    console.error('❌ Ошибка подключения к MongoDB:', error);
  });

module.exports = app;
