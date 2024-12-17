const express = require('express');

const app = express();
const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://127.0.0.1:${PORT}`);
});