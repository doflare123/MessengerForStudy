const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });
const User = require('./models/users');
const { generateSalt, hashPassword, validatePassword } = require('./security/crypt');
const CreateJWT = require('./security/Create_jwt');
const connect = require('./database');
const { execSync } = require('child_process');
const { validEmail } = require('./ValidData/validemail');

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
            return res.status(401).json({ message: "неправильный логин или пароль" });
        }

        if (validatePassword(password, user.password_hash, user.salt)) {
            const jwt = CreateJWT(user.id, user.username, user.email);
            return res.status(200).json({
                jwt: jwt
            });
        } else {
            return res.status(401).json({ message: "неправильный логин или пароль" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

//это особенный запрос, поэтому здесь придется тебе подругому передвать параметр, примерно так /api/CreateSession?email=example@example.com
app.get('/api/ValidEmail', async (req, res) => {
    try {
        const emailIsValid = await validEmail(req.query.email);
        if (!emailIsValid)
            return res.status(409).json({ message: "Email уже зарегистрирован" });

        res.status(200).json({message: "Email валиден"});
    } catch (error) {
        console.warn(error);
        res.status(500).json({ message: "Сервер не смог обработать данные или запрос" });
    }
})

app.post('/api/RegisterAccount', async (req, res) => {
    const {name, email, password} =req.body;
    try {
        const emailIsValid = await validEmail(email);
        if (!emailIsValid)
            return res.status(409).json({ message: "Email уже зарегистрирован" });

        const salt = generateSalt();
        const hashPswd = hashPassword(password, salt);

        const newUser = new User({username: name, email: email, password_hash: hashPswd, salt: salt})
        
        await newUser.save();

        res.status(200).json({ message: "Пользователь успешно зарегистрирован" })
    } catch (error) {
        console.warn(error);
        res.status(500).json( { message: "Сервер не смог обработать данные или запрос" })
    }
})


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
