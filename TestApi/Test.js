const nodemailer = require('nodemailer');
const crypto = require('crypto');
const express = require('express');

const app = express();
const PORT = 8080;

// Функция для генерации случайного кода подтверждения
function generateCode(length = 6) {
  return crypto.randomInt(100000, 999999).toString(); // Генерация шестизначного кода
}

// Функция для отправки письма через SMTP
async function sendEmailWithCode(senderEmail, senderPassword, recipientEmail, code) {
  try {
    // Создание транспортера для отправки письма через SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Используем Gmail SMTP
      auth: {
        user: senderEmail,  // Ваш Gmail адрес
        pass: senderPassword,  // Ваш Gmail пароль или приложение-специальный пароль
      },
    });

    // Создание письма
    const mailOptions = {
      from: senderEmail,
      to: recipientEmail,
      subject: 'Ваш код подтверждения',
      text: `Ваш код подтверждения: ${code}`,  // Текст письма
    };

    // Отправка письма
    const info = await transporter.sendMail(mailOptions);
    console.log('Письмо успешно отправлено: ' + info.response);
  } catch (error) {
    console.error('Ошибка отправки письма: ', error);
  }
}

// Генерация кода
const code = generateCode();
const senderEmail = 'messerverifationstd@gmail.com';  // Ваш email
const senderPassword = 'mxmx mmqu ysfr khnk';  // Ваш пароль или специальный пароль приложения для Gmail
const recipientEmail = 'romeneroma@gmail.com';  // Email получателя

// Отправка письма
app.listen(PORT, () => {
    sendEmailWithCode(senderEmail, senderPassword, recipientEmail, code);
});