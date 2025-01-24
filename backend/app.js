const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });
const User = require('./models/users');
const { generateSalt, hashPassword, validatePassword } = require('./security/crypt');
const CreateJWT = require('./security/Create_jwt');
const connect = require('./database');
const { execSync } = require('child_process');

const app = express();
const PORT = 8081;
app.use(express.json());

app.post('/api/EnterAccount', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({
            where: { email: email },
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (validatePassword(password, user.password_hash, user.salt)) {
            const jwt = CreateJWT(user.id, user.username, user.email);
            return res.status(200).json({
                jwt: jwt
            });
        } else {
            return res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

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
