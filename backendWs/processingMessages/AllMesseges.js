import axios from 'axios';


async function SearchAllMesseges(ws, { contactEmail, JwtToken}) {
    try {
        const response = await axios.post(process.env.URL_CKECK_ALLMESSEGES, { contactEmail }, {headers: {'Authorization': `Bearer ${JwtToken}`}});
        ws.send(JSON.stringify({ success: true, data: response.data })); 
         
    } catch (error) {
        console.error('Ошибка при отправке запроса:', error.message);
        ws.send(JSON.stringify({ success: false, message: 'Какая-то проблема' }));
    }
}

export default SearchAllMesseges;