import axios from 'axios';

async function DeleteUser(ws, { JwtToken }) {
    try {
        const response = await axios.delete(process.env.URL_CKECK_DELETEACCOUNT, {headers: {'Authorization': `Bearer ${JwtToken}`}});
        ws.send(JSON.stringify(response.data)); // Успешный ответ клиенту
    } catch (err) {
        console.error('Ошибка при отправке запроса:', err.message);
        ws.send(JSON.stringify({ success: false, message: 'Ошибка смены пароля' }));
    }
}

export default DeleteUser;
