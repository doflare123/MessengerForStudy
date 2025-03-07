import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import axios from 'axios';
import dotenv from 'dotenv';
import messageHandlers from './processingMessages/GeneralProc.js';

dotenv.config({ path: "./Config.env" });

const app = express();
const PORT = 3000;
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const usersSockets = new Map(); // Сохраняем WebSocket для каждого пользователя

wss.on('connection', (ws) => {
    console.log('Новое WebSocket-соединение установлено');

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message.toString());

            // Регистрация соединения пользователя
            if (data.type === 'registerС') {
                usersSockets.set(data.userId, ws);
                console.log(`Пользователь ${data.userId} подключен`);
                return;
            }

            // Обработка сообщения
            const handler = messageHandlers[data.type];
            if (handler) {
                handler(ws, data, usersSockets); // Передаем usersSockets для доступа к другим соединениям
            } else {
                ws.send(JSON.stringify({ success: false, message: 'Тип запроса не найден' }));
            }
        } catch (error) {
            console.error('Ошибка при обработке данных:', error.message);
            ws.send(JSON.stringify({ success: false, message: 'Ошибка при обработке данных' }));
        }
    });

    ws.on('close', () => {
        for (let [userId, socket] of usersSockets.entries()) {
            if (socket === ws) {
                usersSockets.delete(userId);
                console.log(`Пользователь ${userId} отключен`);
                break;
            }
        }
    });
    
});

// Запуск сервера
server.listen(PORT, (err) => {
    if (err) {
        console.error('Ошибка при запуске сервера:', err);
    } else {
        console.log(`Сервер запущен на http://localhost:${PORT}`);
    }
});

export default server;