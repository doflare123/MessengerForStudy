const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connect = require('./configs/database');

dotenv.config({ path: "./.env" });

const authRoutes = require('./routes/authRoutes');
const registerRoutes = require('./routes/registerRoutes');
const mainRoutes = require('./routes/mainRoutes');
const accountRoutes = require('./routes/accountRoutes');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/main', mainRoutes);
app.use('/api/account', accountRoutes);

app.use((req, res, next) => {
  console.log(`📩 Пришел запрос: ${req.method} ${req.originalUrl}`);
  next(); // Передаем управление следующему middleware
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
