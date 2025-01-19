const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const secretKey = crypto.randomBytes(32); // Секретный ключ для шифрования
const iv = crypto.randomBytes(16); // Инициализационный вектор


// Функция для шифрования сообщения
const encryptMessage = (text) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedData: encrypted, iv: iv.toString('hex') };
  };
  
  // Функция для расшифровки сообщения
  const decryptMessage = (encryptedText, ivHex) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(ivHex, 'hex'));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  };

module.exports ={encryptMessage, decryptMessage};