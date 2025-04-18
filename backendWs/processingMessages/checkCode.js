import axios from 'axios';
import { WebSocketServer } from 'ws';

async function CheckCode(ws, {code, sessionId} ) {
    try {
        console.log(code, sessionId)
        const response = await axios.post(process.env.URL_CKECK_CODECONFIRM, { sessionId, code, type: 'reg' });
        ws.send(JSON.stringify({success: true, data: response.data})); //успешный ответ клиенту
    } catch (err) {
        console.error('Ошибка при отправке запроса:', err.message);
        ws.send(JSON.stringify({ success: false, message: 'Ошибка при отправке запроса на сервер' }));
        
    }
}


export default CheckCode;