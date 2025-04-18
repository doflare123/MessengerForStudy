import axios from 'axios';

async function ChekAllChats(ws, { JwtToken }) {
  try {
    console.log("JwtToken", JwtToken)
    const response = await axios.post(process.env.URL_CKECK_ALLDIALOGS, { }, {headers: {'Authorization': `Bearer ${JwtToken}`}});
    ws.send(JSON.stringify({ success: true, data: response.data.dialogs })); 
  } catch (error) {
    console.error('Ошибка при отправке запроса:', error.message);
    ws.send(JSON.stringify({ success: false, message: 'Проблемы с токеном или id' }));
  }
}

export default ChekAllChats;



