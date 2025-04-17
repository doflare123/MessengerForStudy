const {CreateJWT} =require('../utils/Create_jwt');
const User = require('../models/users');
const { validatePassword } = require('../utils/crypt');

exports.login = async (req, res) =>{
    const { email, password } = req.body;
    try {
        const user = await User.findOne({
            where: { email: email },
        });

        if (!user) {
            return res.status(401).json({ message: "неправильный логин или пароль" });
        }

        if (validatePassword(password, user.password_hash, user.salt)) {
            const jwt = await CreateJWT(user.username, email, user.avatar);
            return res.status(200).json({
                accessToken: jwt.accessToken,
                refreshToken: jwt.refreshToken
            });
        } else {
            return res.status(401).json({ message: "неправильный логин или пароль" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
}