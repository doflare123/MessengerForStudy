import axios from 'axios';

async function Sentmess(ws, { DataTime, JwtToken, recipient, sender, text, Data }, usersSockets) {
    try {
        const recipientSocket = usersSockets.get(recipient);

        if (recipientSocket) {
            console.log('Recipient socket найден:', recipientSocket);
            
            // Проверяем текущее состояние сокета
            console.log('Состояние recipientSocket:', recipientSocket.readyState);

            // Если состояние сокета открытое, продолжаем отправку
            if (recipientSocket.readyState === WebSocket.OPEN) {
                console.log('Сокет готов к отправке данных');
                try {
                    const response = await axios.post(process.env.URL_CKECK_SENTMESSEGE, { DataTime, JwtToken, recipient, sender, text, Data });
                    
                    // Если запрос прошел успешно, отправляем сообщение оппоненту
                    recipientSocket.send(JSON.stringify({
                        success: true,
                        type: 'NewMessage',
                        data: {
                            _id: response.data._id, // Уникальный ID сообщения
                            sender,
                            text,
                            time: DataTime,
                            data: Data,
                        },
                    }));
                
                    console.log('Ответ от axios:', response.data);
                } catch (error) {
                    console.log('Ошибка при запросе:', error.message);
                
                }                
                
            } else {
                console.log("Сокет оппонента не открыт, состояние:", recipientSocket.readyState);
            }
        } else {
            console.log('Recipient socket не найден');
        }
        console.log("Почти конец!")
    } catch (err) {
        console.error('Ошибка при отправке запроса:', err.message);
        ws.send(JSON.stringify({ success: false, message: 'Не удалось отправить сообщение' }));
    }
}

export default Sentmess;
