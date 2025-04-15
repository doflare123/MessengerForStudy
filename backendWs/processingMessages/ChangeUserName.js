import axios from 'axios';

async function UserName(ws, { JwtToken, userName }) {
    try {
        const response = await axios.post(process.env.URL_CKECK_CHANGENAME, { JwtToken, userName });
        ws.send(JSON.stringify(response.data)); // Успешный ответ клиенту
    } catch (err) {
        console.error('Ошибка при отправке запроса:', err.message);
        ws.send(JSON.stringify({ success: false, message: 'Ошибка смены имени' }));
    }
}

export default UserName;
