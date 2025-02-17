const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });
const User = require('./models/users');
const Contact = require('./models/contacts');
const { generateSalt, hashPassword, validatePassword } = require('./utils/crypt');
const {CreateJWT} = require('./utils/Create_jwt');
const connect = require('./configs/database');
const { execSync } = require('child_process');
const { validEmail } = require('./requests/validemail');
const { RefreshAccessToken } = require('./utils/Refresh_jwt');
const authRoutes = require('./routes/authRoutes');
const registerRoutes = require('./routes/registerRoutes')


const app = express();
const PORT = 8081;
app.use(express.json());

// Регистрация
app.use('/api/auth', authRoutes);

//это особенный запрос, поэтому здесь придется тебе подругому передвать параметр, примерно так /api/CreateSession?email=example@example.com
app.use('/api/register', registerRoutes)

app.post('/api/RegisterAccount', async (req, res) => {
    const {name, email, password} = req.body;
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

app.post('/api/ForgotPswd', async(req, res) =>{
    const {email, newPswd} = req.body;
    try {
        const emailIsValid = await validEmail(email);
        if (!emailIsValid)
            return res.status(404).json({ message: "такого email не существует" });
        
        const salt = generateSalt();
        const hash = hashPassword(newPswd, salt);

        const sucs = User.update( {password_hash: hash, salt: salt}, {where: {email: email}} );

        if(!sucs)
            return res.status(500).json({ message: "Сервер не смог сохранть данные, повторите позднее" });

        res.status(200).json({ message: "Пароль успешно сменен" })
    } catch (error) {
        console.warn(error);
        res.status(500).json( { message: "Сервер не смог обработать данные или запрос" })
    }
})


// Main функции
app.post('/api/GetAllDialogs', async(req, res) =>{
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ error: "Token is required" });
    }

    try {
        // Расшифровываем токен
        const decoded = jwt.verify(token, process.env.Secret_key_Jwt);
        const userId = decoded.id;

        // Находим все контакты пользователя
        const contacts = await Contact.findAll({
            where: {
                [Op.or]: [{ user_id: userId }, { contact_id: userId }]
            }
        });

        // Получаем список ID собеседников
        const userIds = contacts.map(contact => 
            contact.user_id === userId ? contact.contact_id : contact.user_id
        );

        if (userIds.length === 0) {
            return res.status(200).json({ dialogs: [] });
        }

        // Ищем последние сообщения с каждым собеседником
        const dialogs = await Promise.all(userIds.map(async (contactId) => {
            const lastMessage = await Message.findOne({
                $or: [
                    { sender_id: String(userId), receiver_id: String(contactId) },
                    { sender_id: String(contactId), receiver_id: String(userId) }
                ]
            }).sort({ data: -1 }).limit(1);

            const contact = await User.findByPk(contactId, { attributes: ['id', 'username', 'email'] });

            return {
                contact: contact ? { id: contact.id, username: contact.username, email: contact.email } : null,
                lastMessage: lastMessage ? {
                    sender_id: lastMessage.sender_id,
                    receiver_id: lastMessage.receiver_id,
                    message_content: lastMessage.message_content,
                    data: lastMessage.data,
                    status: lastMessage.status
                } : null
            };
        }));

        res.status(200).json({ dialogs });

    } catch (error) {
        console.error("JWT verification error:", error);
        res.status(403).json({ error: "Истекший токен или невалидный" });
    }
})

app.post('/api/GetAllMessages', async(req, res) =>{
    
})

app.post('/api/SearchUser', async (req, res) => {
    
})

app.post('/api/SentMessege', async (req, res) => {

})

// Взаимодействия с аккаунтом
app.post('/api/ChangeAvatar', async(req, res) =>{
    
})

app.post('/api/ChangeUsername', async(req, res) =>{
    
})

app.post('/api/ChangePswd', async(req, res) =>{
    
})

app.post('/api/DeleteAccount', async(req, res) =>{
    
})

app.post('/api/RefreshToken', async(req, res) =>{
    const {refreshToken} = req.body;
    try {
        const jwtData = await RefreshAccessToken(refreshToken);

        if(!jwtData)
            res.status(401).json("Невалидный refresh token")

        res.status(200).json({
            AccessToken: jwtData.accessToken,
            RefreshToken: jwtData.refreshToken
        });
    } catch (error) {
        res.status(500).json({message: "Проблема с валидацией на сервере"})
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
