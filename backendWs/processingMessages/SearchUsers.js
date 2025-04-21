import axios from 'axios';

async function SearchUsers(ws, { searchQuery, JwtToken }) {
    try {
        const response = await axios.post(process.env.URL_CKECK_SEARCHUSERS, { searchQuery }, {headers: {'Authorization': `Bearer ${JwtToken}`}});
        ws.send(JSON.stringify({success: true, data: response.data})); // Успешный ответ клиенту
    } catch (error) {
        console.error('Ошибка поиска пользователей:', error);
        ws.send(JSON.stringify({ success: false, message: 'Ошибка поиска пользователей' }));
    }
};

export default SearchUsers;
