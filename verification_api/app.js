const nodemailer = require('nodemailer');
const crypto = require('crypto');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });
const SessionRegister = require('./models/session_model');
const connection = require('./database');
const { execSync } = require('child_process'); // Для синхронного выполнения команд
const { default: axios } = require('axios');
const SessionPass = require('./models/session_chng_model');
const SessionCodes = require('./models/session_codes_model');

const app = express();
const PORT = 8082;
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
    console.log('Письмо успешно отправлено');
  } catch (error) {
    console.error('Ошибка отправки письма: ', error);
  }
}

app.post('/api/CreateSession', async (req, res) => {
  try {
    const { email, type } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email обязателен" });
    }

    try {
      const response = await axios.post(process.env.URL_CHECK_USER, { email });

      if (response.status !== 200) {
        return res.status(409).json({ message: "Скорее всего, этот email уже используется" });
      }
    } catch (error) {
      console.error("Ошибка при проверке email:", error.response?.data || error.message);
      return res.status(500).json({ message: "При обработке запроса произошла ошибка" });
    }

    const sessionId = generateSessionId();
    const confirmCode = generateCode();


    switch (type) {
      case "reg":
        await SessionRegister.create({
          SessionId: sessionId,
          Validation: false,
        });
        break;

      case "chng":
        await SessionPass.create({
          SessionId: sessionId,
          Validation: false,
        });
        break;

      default:
        res.status(400).json({ message: "Неверный тип сессии" });
    }

    await SessionCodes.create({
      SessionId: sessionId,
      CodeConfirm: confirmCode,
      TypeSession: type === "reg",
    });

    await sendEmailWithCode(email, confirmCode);

    res.status(200).json({
      sessionId: sessionId,
    });
  } catch (error) {
    console.error("Ошибка создания сессии:", error);
    res.status(500).json({
      message: "При создании сессии произошла ошибка",
    });
  }
});



app.post('/api/CheckSession', async (req, res) => {
  const { sessionId, code } = req.body;
  try {
    const session = await SessionRegister.findOne({
      where: { SessionId: sessionId },
    });

    if (!session) {
      return res.status(404).json({
        message: 'Сессия не найдена',
      });
    }

    if (session.CodeConfirm === parseInt(code)) {
      const deletedRows = await SessionRegister.destroy({
        where: { SessionId: SessionId }
      });
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

app.post('/api/RefreshCode', async (req, res) => {
  const {email, session} = req.body;
  try {
    const newCode = generateCode();

    await SessionRegister.create({
      SessionId: session,
      CodeConfirm: newCode,
    });

    await sendEmailWithCode(email, newCode);

    res.status(200);
  } catch (error) {
    res.status(500);
  }
})

connection.sync()
  .then(() => {
    console.log('Таблицы успешно синхронизированы!');
  })
  .catch((err) => {
    console.error('Ошибка синхронизации таблиц: ', err);
  });

  app.listen(PORT, () => {
    console.log("Сервер работает");
  });

module.exports = app;

