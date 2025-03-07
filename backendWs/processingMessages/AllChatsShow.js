import axios from 'axios';

async function ChekAllChats(ws, { JwtToken, UserId }) {
  try {
    const response = await axios.post(process.env.URL_CKECK_ALLDIALOGS, { JwtToken, UserId });
    ws.send(JSON.stringify({ success: true, data: response.data.FindDialogs })); 
  } catch (error) {
    console.error('Ошибка при отправке запроса:', error.message);
    ws.send(JSON.stringify({ success: false, message: 'Проблемы с токеном или id' }));
  }
}

export default ChekAllChats;



