const {validEmail} = require('../requests/validemail')


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