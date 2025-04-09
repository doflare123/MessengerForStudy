const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connect = require('./configs/database');
const winston = require('winston');
require('winston-daily-rotate-file');

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
  maxFiles: '30d'
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
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

// Логирование тела запроса (в dev-среде)
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    logger.debug(`🔍 Тело запроса: ${JSON.stringify(req.body)}`);
  }
  next();
});

// Логирование ответов, времени и IP
app.use((req, res, next) => {
  const start = Date.now();
  const ip = req.ip || req.connection.remoteAddress;

  // Обертка res.send для логирования тела ответа (опционально)
  const originalSend = res.send;
  res.send = function (body) {
    if (process.env.NODE_ENV === 'development') {
      logger.debug(`📤 Ответ: ${body}`);
    }
    originalSend.call(this, body);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 500 ? 'error' :
                     res.statusCode >= 400 ? 'warn' : 'info';

    logger.log({
      level: logLevel,
      message: `📨 ${req.method} ${req.originalUrl} → ${res.statusCode} | 🕒 ${duration}ms | 🌐 IP: ${ip}`
    });
  });

  next();
});

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/main', mainRoutes);
app.use('/api/account', accountRoutes);

// Обработчик ошибок
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const ip = req.ip || req.connection.remoteAddress;

  logger.error(`❌ Ошибка при ${req.method} ${req.originalUrl}
▶ Статус: ${statusCode}
▶ IP: ${ip}
▶ Сообщение: ${err.message}
▶ Стек: ${err.stack}`);

  res.status(statusCode).json({
    status: 'error',
    message: err.message,
  });
});

// Подключение к MongoDB
mongoose.connect(process.env.BD_MONGO_URI)
  .then(() => {
    console.log('✅ Подключено к MongoDB');

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
