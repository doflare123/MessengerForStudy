const nodemailer = require('nodemailer');
const crypto = require('crypto');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });
const Session = require('./models/session_model');
const connection = require('./database');
const { execSync } = require('child_process'); // Для синхронного выполнения команд

const app = express();
const PORT = 8080;
app.use(express.json());

// Функция для генерации случайного кода подтверждения
function generateCode(length = 6) {
  return crypto.randomInt(100000, 999999).toString(); // Генерация шестизначного кода
}

function generateSessionId() {
  return crypto.randomBytes(6).toString('hex'); // 6 байт = 12 символов в hex-формате
}

async function sendEmailWithCode(recipientEmail, code) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.messege_email,
        pass: process.env.messege_email_pswd,
      },
    });

    const mailOptions = {
      from: process.env.messege_email,
      to: recipientEmail,
      subject: 'Ваш код подтверждения',
      text: `Ваш код подтверждения: ${code}`,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Письмо успешно отправлено: ' + info.response);
  } catch (error) {
    console.error('Ошибка отправки письма: ', error);
  }
}

app.get('/api/CreateSession', async (req, res) => {
  try {
    const sessionId = generateSessionId();
    const confimCode = generateCode();

    await Session.create({
      SessionId: sessionId,
      CodeConfirm: confimCode,
    });

    await sendEmailWithCode(req.query.email, confimCode);

    res.status(200).json({
      sessionId: sessionId,
    });
  } catch (error) {
    res.status(500).json({
      message: "При создании сессии произошла ошибка",
    });
  }
});

app.post('/api/CheckSession', async (req, res) => {
  const { sessionId, code } = req.body;
  try {
    const session = await Session.findOne({
      where: { SessionId: sessionId },
    });

    if (!session) {
      return res.status(404).json({
        message: 'Сессия не найдена',
      });
    }

    if (session.CodeConfirm === parseInt(code)) {
      return res.status(200).json();
    } else {
      return res.status(400).json({
        message: "Неверный код подтверждения",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "При проверке сессии произошла ошибка на сервере",
    });
  }
});

connection.sync()
  .then(() => {
    console.log('Таблицы успешно синхронизированы!');
  })
  .catch((err) => {
    console.error('Ошибка синхронизации таблиц: ', err);
  });

// Запуск тестов перед запуском сервера
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
  });
}

module.exports = app;

