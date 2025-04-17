import axios from 'axios';

async function ChangePassFogive(ws, { email, newPswd }) {
    try {
        const response = await axios.patch(process.env.URL_CKECK_CHANGEPASS, { email, newPswd });
        ws.send(JSON.stringify(response.data)); // Успешный ответ клиенту
    } catch (err) {
        console.error('Ошибка при отправке запроса:', err.message);
        ws.send(JSON.stringify({ success: false, message: 'Ошибка смены пароля' }));
    }
}

export default ChangePassFogive;
