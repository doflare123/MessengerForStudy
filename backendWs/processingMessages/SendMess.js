import axios from 'axios';

async function Sentmess(ws, {JwtToken, messageContent, contactEmail}, usersSockets) {
    try {
        const recipientSocket = usersSockets.get(contactEmail);

        if (recipientSocket) {
            console.log('Recipient socket найден:');
            
            // Проверяем текущее состояние сокета
            console.log('Состояние recipientSocket:');

            // Если состояние сокета открытое, продолжаем отправку
            if (recipientSocket.readyState === WebSocket.OPEN) {
                console.log('Сокет готов к отправке данных');
                try {
                    const response = await axios.post(process.env.URL_CKECK_SENTMESSEGE, { messageContent, contactEmail }, {headers: {'Authorization': `Bearer ${JwtToken}`}});
                    
                    // Если запрос прошел успешно, отправляем сообщение оппоненту
                    recipientSocket.send(JSON.stringify({
                        success: true,
                        type: 'NewMessage',
                        data: {
                            isUser: false,
                            text: messageContent,
                        },
                    }));
                
                    console.log('Ответ от axios:');
                } catch (error) {
                    console.log('Ошибка при запросе:');
                
                }                
                
            } else {
                console.log("Сокет оппонента не открыт, состояние:");
            }
        } else {
            console.log('Recipient socket не найден');
        }
        console.log("Почти конец!")
    } catch (err) {
        console.error('Ошибка при отправке запроса:');
        ws.send(JSON.stringify({ success: false, message: 'Не удалось отправить сообщение' }));
    }
}

export default Sentmess;
