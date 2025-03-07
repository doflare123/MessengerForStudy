import axios from 'axios';

async function UserPass(ws, { JwtToken, UserId, newPassword }) {
    try {
        const response = await axios.post(process.env.URL_CKECK_CHANGEPASS, { JwtToken, UserId, newPassword });
        ws.send(JSON.stringify(response.data)); // Успешный ответ клиенту
    } catch (err) {
        console.error('Ошибка при отправке запроса:', err.message);
        ws.send(JSON.stringify({ success: false, message: 'Ошибка смены пароля' }));
    }
}

export default UserPass;
