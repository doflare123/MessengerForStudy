import axios from 'axios';
import { WebSocketServer } from 'ws';

async function CheckEmailForgive(ws, {email} ) {
    try {
        console.log("email", email)
        const response = await axios.post(process.env.URL_CKECK_SESSIONCREATE, { email: email, type: 'chng' });
        ws.send(JSON.stringify({success: true, data: response.data})); //успешный ответ клиенту
    } catch (err) {
        console.error('Ошибка при отправке запроса:', err.message);
        ws.send(JSON.stringify({ success: false, message: 'Ошибка при отправке запроса на сервер' }));
        
    }
}


export default CheckEmailForgive;