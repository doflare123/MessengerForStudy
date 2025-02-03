const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./Config.env" });

async function RefreshAccessToken(refreshToken) {
    try {
        const decoded = jwt.verify(refreshToken, process.env.Secret_key_Jwt);

        const newAccessToken = jwt.sign({
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
            Enterprise: decoded.Enterprise
        }, process.env.Secret_key_Jwt, { expiresIn: '30m' });

        const newRefreshToken = jwt.sign({
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
            Enterprise: decoded.Enterprise
        }, process.env.Secret_key_Jwt, { expiresIn: '7d' });

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (err) {
        return false
    }
}

module.exports = {RefreshAccessToken};
