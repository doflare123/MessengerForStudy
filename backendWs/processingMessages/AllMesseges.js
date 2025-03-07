import axios from 'axios';


async function SearchAllMesseges(ws, { JwtToken, UserId, AponentName}) {
    try {
        const response = await axios.post(process.env.URL_CKECK_ALLMESSEGES, { JwtToken, UserId, AponentName });
        ws.send(JSON.stringify({ success: true, data: response.data.FindMessages })); 
        
    } catch (error) {
        console.error('Ошибка при отправке запроса:', error.message);
        ws.send(JSON.stringify({ success: false, message: 'Какая-то проблема' }));
    }
}

export default SearchAllMesseges;