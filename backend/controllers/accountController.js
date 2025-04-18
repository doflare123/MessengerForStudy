const User = require('../models/users');
const { generateSalt, hashPassword} = require('../utils/crypt');
const { validEmail } = require('../requests/validemail');
const { RefreshAccessToken } = require('../utils/Refresh_jwt');
const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });
const jwt = require('jsonwebtoken');
const { default: axios } = require('axios');
const upload = require('../middleware/upload');

exports.ChangeAvatar = [
  upload.single('avatar'), 
  async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    try {
      const decoded = jwt.verify(token, process.env.Secret_key_Jwt);
      const userEmail = decoded.email;

      const imageUrl = req.file?.path; // ссылка на Cloudinary

      if (!imageUrl) {
        return res.status(400).json({ message: 'Файл не загружен' });
      }

      const [updatedRows] = await User.update(
        { avatar: imageUrl },
        { where: { email: userEmail } }
      );

      if (updatedRows === 0) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      res.status(200).json({ message: 'Аватар обновлён', avatarUrl: imageUrl });
    } catch (err) {
      console.error(err);
      res.status(403).json({ message: 'Неверный или истекший токен' });
    }
  }
];



exports.ChangeUserName = async (req, res) =>{
    const { userName } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    try {
        const decoded = jwt.verify(token, process.env.Secret_key_Jwt);
        const userEmail = decoded.email;

        const [updatedRows] = await User.update(
            { username: userName },
            { where: { email: userEmail } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.status(200).json({ message: 'Имя пользователя изменено'});
    } catch (error) {
        res.status(403).json({ message: 'Неверный или истекший токен' });
    }
}

exports.PswdChng = async (req, res) => {
    const { email, newPswd, session, type } = req.body;

    if(!email || !newPswd || !session || !type){
        return res.status(404).json({ message: "Отсутсвуют некоторые поля"})
    }
    try {
        const emailIsValid = await validEmail(email);
        if (emailIsValid)
            return res.status(404).json({ message: "Такого email не существует" });

        const check = await axios.get(process.env.URL_CHECK_VERIFCHECK, {
            params: { session, type },
            validateStatus: () => true
            });
        
        if(check.status == 200){
            const salt = generateSalt();
            const hash = hashPassword(newPswd, salt);
    
            const [updatedRows] = await User.update(
                { password_hash: hash, salt: salt },
                { where: { email: email } }
            );
    
            if (updatedRows === 0)
                return res.status(500).json({ message: "Не удалось сменить пароль, попробуйте позже" });
    
            res.status(200).json({ message: "Пароль успешно сменен" });
        }
    } catch (error) {
        console.warn(error);
        res.status(500).json({ message: "Сервер не смог обработать данные или запрос" });
    }
};

exports.PswdChngAcc = async (req, res) => {
    const { newPswd } = req.body;

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Токен не предоставлен' });
    }


    try {
        const decoded = jwt.verify(token, process.env.Secret_key_Jwt);
        const userEmail = decoded.email;

        const salt = generateSalt();
        const hash = hashPassword(newPswd, salt);

        const [updatedRows] = await User.update(
            { password_hash: hash, salt: salt },
            { where: { email: userEmail } }
        );

        if (updatedRows === 0)
            return res.status(500).json({ message: "Не удалось сменить пароль, попробуйте позже" });

        res.status(200).json({ message: "Пароль успешно сменен" });
    } catch (error) {
        console.warn(error);
        res.status(500).json({ message: "Сервер не смог обработать данные или запрос" });
    }
};


exports.DeleteAccount = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    try {
        const decoded = jwt.verify(token, process.env.Secret_key_Jwt);
        const userEmail = decoded.email;

        const deletedRows = await User.destroy({
            where: { email: userEmail }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.status(200).json({ message: 'Аккаунт успешно удалён' });
    } catch (error) {
        res.status(403).json({ message: 'Неверный или истекший токен' });
    }
};

exports.RefreshToken = async (req, res) =>{
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
}