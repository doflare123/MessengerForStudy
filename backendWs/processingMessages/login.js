import axios from 'axios';

async function LoginCheck(ws, { email, password }) {
    try {
        const response = await axios.post(process.env.URL_CHECK_USER, { email, password });
        ws.send(JSON.stringify(response.data)); // Успешный ответ клиенту
    } catch (err) {
        console.error('Ошибка при отправке запроса:', err.message);
        ws.send(JSON.stringify({ success: false, message: 'Неверный логин или пароль' }));
    }
}

export default LoginCheck;
