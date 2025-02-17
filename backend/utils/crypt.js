const crypto = require('crypto');

// Функция для генерации соли
const generateSalt = () => {
  return crypto.randomBytes(16).toString('hex'); // Генерируем случайные байты и конвертируем в шестнадцатеричную строку
};

// Функция для хеширования пароля с солью
const hashPassword = (password, salt) => {
  const data = password + salt;

  // Хешируем строку с использованием SHA-256
  const hash = crypto.createHash('sha256').update(data).digest('hex');

  return hash;
};

// Функция для проверки пароля на валидность
const validatePassword = (inputPassword, storedHash, salt) => {
  // Хешируем введенный пароль с использованием соли из базы данных
  const hash = hashPassword(inputPassword, salt);

  // Сравниваем хешированный введенный пароль с хранимым хэшем
  return hash === storedHash;
};

module.exports = { generateSalt, hashPassword, validatePassword };
