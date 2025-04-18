import axios from 'axios';
import { WebSocketServer } from 'ws';

async function RegisterCheck(ws, {name, email, password, session} ) {
    try {
        
        const response = await axios.post(process.env.URL_CKECK_REGISTER, { name, email, password,  session, type: "reg"});
        ws.send(JSON.stringify({ success: true, data: response.data})); //успешный ответ клиенту
    } catch (err) {
        console.error('Ошибка при отправке запроса:', err.message);
        ws.send(JSON.stringify({ success: false, message: 'Ошибка при отправке запроса на сервер' }));
        
    }
}


export default RegisterCheck;