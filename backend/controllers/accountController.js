const User = require('../models/users');
const { generateSalt, hashPassword} = require('./utils/crypt');
const { validEmail } = require('./requests/validemail');
const { RefreshAccessToken } = require('./utils/Refresh_jwt');

exports.ChangeAvatar = async (req, res) =>{

}

exports.ChangeUsername = async (req, res) =>{
    
}

exports.PswdChng = async (req, res) =>{
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
}

exports.DeleteAccount = async (req, res) =>{
    
}

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