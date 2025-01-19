const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./Config.env" });




async function CreateJWT(id, username, name){
    const payload = {
        id: id,
        username: username,
        email: email
    }

    return jwt.sign(payload, process.env.Secret_key_Jwt)
}

module.exports = CreateJWT;