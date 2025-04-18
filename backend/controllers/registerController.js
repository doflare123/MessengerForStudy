const {validEmail} = require('../requests/validemail');
const {generateSalt, hashPassword} = require('../utils/crypt');
const User = require('../models/users');
const { default: axios } = require('axios');



exports.Validation = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email обязателен" });
        }
        
        const emailIsValid = await validEmail(email);
        if (!emailIsValid) {
            return res.status(409).json({ message: "Email уже зарегистрирован" });
        }

        res.status(200).json({ message: "Email валиден" });
    } catch (error) {
        console.warn(error);
        res.status(500).json({ message: "Сервер не смог обработать данные или запрос" });
    }
};

exports.Register = async (req, res) =>{
    const {name, email, password, session, type} = req.body;
    try {
        const emailIsValid = await validEmail(email);
        if (!emailIsValid) {
            return res.status(409).json({ message: "Email уже зарегистрирован" });
        }
        const check = await axios.get(process.env.URL_CHECK_VERIFCHECK, {
            params: { session, type },
            validateStatus: () => true
          });

        if(check.status == 200){
            const salt = generateSalt();
            const hashPswd = hashPassword(password, salt);
    
            const newUser = new User({username: name, email: email, password_hash: hashPswd, salt: salt})
            
            await newUser.save();
    
            res.status(200).json({ message: "Пользователь успешно зарегистрирован" })
        }else{
            res.status(400).json({ message: "Сессия не подтверждена" })
        }
    } catch (error) {
        console.warn(error);
        res.status(500).json( { message: "Сервер не смог обработать данные или запрос" })
    }
}