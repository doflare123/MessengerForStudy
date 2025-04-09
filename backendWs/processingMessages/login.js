import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: "./.env" });

async function LoginCheck(ws, { email, password }) {
    try {
        const response = await axios.post(process.env.URL_CKECK_LOGIN, { email, password });
        ws.send(JSON.stringify({success: true, data: response.data})); // Успешный ответ клиенту
    } catch (err) {
        console.error('Ошибка при отправке запроса:', err.message);
        ws.send(JSON.stringify({ success: false, message: 'Неверный логин или пароль' }));
    }
}

export default LoginCheck;