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

app.post('/api/CreateSession/register', async (req, res) => {
  try {
    const { email, type } = req.body;
    let response;
    if (!email || !type) {
      res.status(400).json({ message: "Email обязателен" });
    }

    try {
      if(type == "reg")
        response = await axios.post(process.env.URL_CHECK_USER, { email });
        
      if (response.status !== 200)
        res.status(409).json({ message: "Скорее всего, этот email уже используется" });
      
    } catch (error) {
      console.error("Ошибка при проверке email:", error.response?.data || error.message);
      res.status(500).json({ message: "При обработке запроса произошла ошибка" });
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


app.post('/api/CreateSession/account', async (req, res) =>{
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  } 

  try {
    const decoded = jwt.verify(token, process.env.Secret_key_Jwt);
    const senderEmail = decoded.email;

    const sessionId = generateSessionId();
    const confirmCode = generateCode();

    await SessionPass.create({
      SessionId: sessionId,
      Validation: false,
    });

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
    
  }
})


app.post('/api/CheckSession/Codes', async (req, res) => {
  const { sessionId, code, type} = req.body;

  if (!sessionId || !code || !type) {
    return res.status(400).json({ message: "Код обязателен" });
  }

  try {
    session = await SessionCodes.findOne({
      where: { SessionId: sessionId },
    });

    if (!session) {
      res.status(404).json({
        message: 'Сессия не найдена',
      });
    }

    if (session.CodeConfirm === parseInt(code)) {
      let ses;

      switch(type){
        case "reg":
          ses = SessionRegister.update({verified: true}, {where: {SessionId: SessionId}});
          break;
        case "chng":
          ses = SessionPass.update({verified: true}, {where: {SessionId: SessionId}});
          break;
        default:
          res.status(400).json({messege: "неверный тип"})

        if(!ses)
          res.status(500).json("Сервер не смог по какой-то причине верифицировать сессию");
    }
      
      res.status(200);
    } else {
      session.Attempts += 1;

      if (session.Attempts >= 3) {
        await session.destroy();
        switch(type){
          case "reg":
            ses = SessionRegister.destroy({where: {SessionId: SessionId}});
            break;
          case "chng":
            ses = SessionPass.destroy({where: {SessionId: SessionId}});
            break;
          default:
            res.status(500).json({messege: "Ошибка сессии на сервере"})
        }
        return res.status(400).json({ message: "Превышено количество попыток, сессия удалена" });
      } else {
        await session.save();
      }

      return res.status(400).json({ message: "Неверный код подтверждения" });
    }
  } catch (error) {
    res.status(500).json({
      message: "При проверке сессии произошла ошибка на сервере",
    });
  }
});

//http://localhost:3000api/CheckSession/Verify?param1=value1$param2=value2
app.get('api/CheckSession/Verify', async (req, res) =>{
    const { session, type } = req.query;

    if(!session || !type)
      res.status(400).json({message:"Сессия отсуствует в запрсе"})

    try {
      let ses;
      switch(type){
        case "reg":
          ses = await SessionRegister.findOne({
            where: { SessionId: session },
          });
          break;
        case "chng":
          ses = await SessionPass.findOne({
            where: { SessionId: session },
          });
          break;
        default:
          res.status(409);
      }

      if(ses.verified)
        res.status(200);

      res.status(400);
    } catch (error) {
      console.error(error);
      res.status(500);
    }
    
})

app.post('/api/RefreshCode', async (req, res) => {
  const {email, session, type} = req.body;
  try {
    const newCode = generateCode();

    switch (type){
      case "reg":
        await SessionRegister.create({
          SessionId: session,
          Validation: false,
        });
        break;
      case "chng":
        await SessionPass.create({
          SessionId: session,
          Validation: false,
        });
        break;
      default:
        res.status(409)
    }

    await SessionCodes.create({
      SessionId: session,
      CodeConfirm: confirmCode,
      TypeSession: type === "reg",
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

