import React, { createContext, useContext, useEffect, useState } from 'react';
import Constants from 'expo-constants';

const URL = Constants.expoConfig.extra.apiUrl;

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket(URL);  // Подключение к WebSocket-серверу
        setSocket(ws);

        ws.onopen = () => {
            console.log("Соединение установлено");
        };

        ws.onclose = (event) => {
            console.log("WebSocket соединение закрыто:", event);
        };

        ws.onerror = (error) => {
            console.log("Ошибка WebSocket:", error);
        };

        return () => {
            ws.close(1000, "Компонент размонтирован, соединение закрыто");
        };
    }, []);


    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
