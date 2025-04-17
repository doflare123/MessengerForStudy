import axios from 'axios';

async function changeAvatar(ws, { JwtToken, avatar }) {
    try {
        const response = await axios.patch(process.env.URL_CKECK_CHANGEAVATAR, { avatar }, {headers: {'Authorization': `Bearer ${JwtToken}`}});
        ws.send(JSON.stringify(response.data)); // Успешный ответ клиенту
    } catch (err) {
        console.error('Ошибка при отправке запроса:', err.message);
        ws.send(JSON.stringify({ success: false, message: 'Ошибка смены пароля' }));
    }
}

export default changeAvatar;
