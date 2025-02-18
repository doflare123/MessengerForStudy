const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });
const connect = require('./configs/database');
const { execSync } = require('child_process');

const authRoutes = require('./routes/authRoutes');
const registerRoutes = require('./routes/registerRoutes');
const mainRoutes = require('./routes/mainRoutes');
const accountRoutes = require('./routes/accountRoutes')

const app = express();
const PORT = 8081;
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/main', mainRoutes);
app.use('/api/account', accountRoutes)

if (require.main === module) {
    try {
        // Запускаем тесты перед тем, как запустить сервер
        execSync('npx jest --runInBand', { stdio: 'inherit' });
    } catch (error) {
        console.error('Тесты не прошли, сервер не будет запущен');
        process.exit(1); // Если тесты не прошли, не запускаем сервер
    }

    // Если тесты прошли, запускаем сервер
    app.listen(PORT, () => {
        console.log("Сервер работает");

        // Переместите синхронизацию таблиц сюда
        connect.sync()
          .then(() => {
            console.log('Таблицы успешно синхронизированы!');
          })
          .catch((err) => {
            console.error('Ошибка синхронизации таблиц: ', err);
          });
    });
}

module.exports = app;
