const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./Config.env" });




async function CreateJWT(username, email){
    const payload = {
        username: username,
        email: email,
        Enterprise: "Necrodwarf"
    }

    const accessToken = jwt.sign(payload, process.env.Secret_key_Jwt, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, process.env.Secret_key_Jwt, { expiresIn: '2d' });

    return { accessToken, refreshToken };
}

module.exports = {CreateJWT};