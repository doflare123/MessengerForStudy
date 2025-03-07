import axios from 'axios';

async function SearchUsers(ws, { JwtToken, searchQuery }) {
    try {
        const response = await axios.post(process.env.URL_CKECK_SEARCHUSERS, { JwtToken, searchQuery });
        ws.send(JSON.stringify(response.data)); // Успешный ответ клиенту
    } catch (error) {
        console.error('Ошибка поиска пользователей:', error);
        ws.send(JSON.stringify({ success: false, message: 'Ошибка поиска пользователей' }));
    }
};

export default SearchUsers;
