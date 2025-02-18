const {validEmail} = require('../requests/validemail')


//это особенный запрос, поэтому здесь придется тебе подругому передвать параметр, примерно так /api/register/validEmail?email=example@example.com
exports.Validation = async (req, res) =>{
    try {
        const emailIsValid = await validEmail(req.query.email);
        if (!emailIsValid)
            return res.status(409).json({ message: "Email уже зарегистрирован" });

        res.status(200).json({message: "Email валиден"});
    } catch (error) {
        console.warn(error);
        res.status(500).json({ message: "Сервер не смог обработать данные или запрос" });
    }
}

exports.Register = async (req, res) =>{
    const {name, email, password} = req.body;
    try {
        const emailIsValid = await validEmail(email);
        if (!emailIsValid)
            return res.status(409).json({ message: "Email уже зарегистрирован" });

        const salt = generateSalt();
        const hashPswd = hashPassword(password, salt);

        const newUser = new User({username: name, email: email, password_hash: hashPswd, salt: salt})
        
        await newUser.save();

        res.status(200).json({ message: "Пользователь успешно зарегистрирован" })
    } catch (error) {
        console.warn(error);
        res.status(500).json( { message: "Сервер не смог обработать данные или запрос" })
    }
}