import axios from 'axios';

async function UserPass(ws, { JwtToken, newPswd }) {
    try {
        const response = await axios.patch(process.env.URL_CKECK_CHANGEPASSACC, { newPswd }, {headers: {'Authorization': `Bearer ${JwtToken}`}});
        ws.send(JSON.stringify(response.data)); // Успешный ответ клиенту
    } catch (err) {
        console.error('Ошибка при отправке запроса:', err.message);
        ws.send(JSON.stringify({ success: false, message: 'Ошибка смены пароля' }));
    } 
}

export default UserPass;
