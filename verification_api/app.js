const nodemailer = require('nodemailer');
const crypto = require('crypto');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });
const connection = require('./database');
const { default: axios } = require('axios');
const SessionCodes = require('./models/session_codes_model');
const Session = require('./models/session_model');

const winston = require('winston');
require('winston-daily-rotate-file');

const app = express();
const PORT = 8082;
app.use(express.json());

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

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const ip = req.ip || req.connection.remoteAddress;

  logger.error(`❌ Ошибка при ${req.method} ${req.originalUrl}
▶️ Статус: ${statusCode}
▶️ IP: ${ip}
▶️ Сообщение: ${err.message}
▶️ Стек: ${err.stack}`);

  res.status(statusCode).json({
    status: 'error',
    message: err.message,
  });
});

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

app.post('/api/CreateSession/register', async (req, res) => {
  const { email, type } = req.body;

  if (!email || !type) {
    return res.status(400).json({ message: "Email и type обязательны" });
  }

  if (!["reg", "chng"].includes(type)) {
    return res.status(400).json({ message: "Неверный тип сессии" });
  }

  if (type === "reg") {
    try {
      const check = await axios.post(process.env.URL_CHECK_Email, { email }, {
        validateStatus: () => true
      });
      if (check.status !== 200) {
        return res.status(409).json({ message: "Email уже используется" });
      }
    } catch (error) {
      console.log("ПРоблема в емейлах")
      return res.status(500).json({ message: "Ошибка при проверке email" });
    }
  }
  if(type === "chng"){
    try {
      console.log(type)
      const check = await axios.post(process.env.URL_CHECK_Email, { email }, {
        validateStatus: () => true
      });
      console.log(check)
    } catch (error) {
      console.log("облема в емейлах")
      return res.status(500).json({ message: "Ошибка при проверке email" });
    }
  }

  const sessionId = generateSessionId();
  const confirmCode = generateCode();

  try {
    await Session.create({
      SessionId: sessionId,
      Type: type,
      verified: false,
    });

    await SessionCodes.create({
      SessionId: sessionId,
      CodeConfirm: confirmCode,
      TypeSession: type === "reg",
    });

    await sendEmailWithCode(email, confirmCode);

    res.status(200).json({ session: sessionId });
  } catch (error) {
    console.error("Ошибка при создании сессии:", error);
    res.status(500).json({ message: "Ошибка сервера при создании сессии" });
  }
});


app.post('/api/CreateSession/account', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  try {
    const decoded = jwt.verify(token, process.env.Secret_key_Jwt);
    const email = decoded.email;

    const sessionId = generateSessionId();
    const confirmCode = generateCode();

    await Session.create({
      SessionId: sessionId,
      verified: false,
    });

    await SessionCodes.create({
      SessionId: sessionId,
      CodeConfirm: confirmCode,
      TypeSession: "chng",
    });

    await sendEmailWithCode(email, confirmCode);

    res.status(200).json({ sessionId });
  } catch (error) {
    console.error("Ошибка в /CreateSession/account:", error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});



app.post('/api/CheckSession/Codes', async (req, res) => {
  const { sessionId, code, type } = req.body;

  if (!sessionId || !code || !type) {
    return res.status(400).json({ message: "Все поля обязательны" });
  }

  if (!["reg", "chng"].includes(type)) {
    return res.status(400).json({ message: "Неверный тип сессии" });
  }

  try {
    const sessionCode = await SessionCodes.findOne({ where: { SessionId: sessionId } });
    if (!sessionCode) return res.status(404).json({ message: "Сессия не найдена" });

    if (sessionCode.CodeConfirm.toString() === code.toString()) {
      await Session.update({ Verified: true }, { where: { SessionId: sessionId, Type: type } });
      return res.status(200).json({ message: "Код подтверждён" });
    }

    sessionCode.Attempts += 1;

    if (sessionCode.Attempts >= 3) {
      await sessionCode.destroy();
      await Session.destroy({ where: { SessionId: sessionId } });
      return res.status(400).json({ message: "Превышено число попыток. Сессия удалена" });
    }

    await sessionCode.save();
    res.status(400).json({ message: "Неверный код подтверждения" });

  } catch (error) {
    console.error("Ошибка проверки кода:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

//http://localhost:3000api/CheckSession/Verify?param1=value1$param2=value2
app.get('/api/CheckSession/Verify', async (req, res) => {
  const { session, type } = req.query;

  if (!session || !type) {
    return res.status(400).json({ message: "session и type обязательны" });
  }

  if (!["reg", "chng"].includes(type)) {
    return res.status(400).json({ message: "Неверный тип сессии" });
  }

  try {
    const sessionObj = await Session.findOne({ where: { SessionId: session } });
    if (!sessionObj) return res.status(404).json({ message: "Сессия не найдена" });

    if (sessionObj.Verified) {
      return res.status(200).json({ Verified: true });
    } else {
      return res.status(200).json({ Verified: false });
    }

  } catch (error) {
    console.error("Ошибка верификации:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.post('/api/RefreshCode', async (req, res) => {
  const { email, session, type } = req.body;

  if (!email || !session || !type) {
    return res.status(400).json({ message: "email, session и type обязательны" });
  }

  if (!["reg", "chng"].includes(type)) {
    return res.status(400).json({ message: "Неверный тип сессии" });
  }

  try {
    const newCode = generateCode();

    await SessionCodes.create({
      SessionId: sessionId,
      CodeConfirm: newCode,
      TypeSession: type,
    });

    await sendEmailWithCode(email, newCode);

    res.status(200).json({ message: "Код обновлён и отправлен" });
  } catch (error) {
    console.error("Ошибка при обновлении кода:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});


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

