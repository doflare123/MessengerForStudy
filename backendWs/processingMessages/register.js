import axios from 'axios';
import { WebSocketServer } from 'ws';

async function RegisterCheck(ws, {UserName, email, password} ) {
    try {
        const response = await axios.post(process.env.URL_CREATE_USER, { UserName, email, password });
        ws.send(JSON.stringify(response.data)); //успешный ответ клиенту
    } catch (err) {
        switch(err.response.status){
            case 402:
                console.error('Ошибка при отправке запроса:', err.message);
                ws.send(JSON.stringify({ success: false, message: 'Некорректный формат электронной почты' }));
                break;
            case 403:
                console.error('Ошибка при отправке запроса:', err.message);
                ws.send(JSON.stringify({ success: false, message: 'Электронная почта или никнейм уже используется' }));
                break;
            default:
                console.error('Ошибка при отправке запроса:', err.message);
                ws.send(JSON.stringify({ success: false, message: 'Ошибка при отправке запроса на сервер' }));
                break;
        }
        
    }
}


export default RegisterCheck;