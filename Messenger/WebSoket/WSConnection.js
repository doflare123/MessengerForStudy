import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Toast from 'react-native-toast-message';

const URL = `ws://10.197.33.35:3000`;
const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const reconnectInterval = useRef(null);
    const isUnmounted = useRef(false);
    const didReconnect = useRef(false); // чтобы не показывать тост при первом подключении

    const connect = () => {
        const ws = new WebSocket(URL);
        setSocket(ws);

        ws.onopen = () => {
            console.log("Соединение установлено");

            if (didReconnect.current) {
                Toast.show({
                    type: 'success',
                    text1: 'Соединение восстановлено',
                    visibilityTime: 2000,
                    position: 'top',
                    topOffset: 50,
                    props: {
                        style: {
                            alignSelf: 'flex-end',
                            width: 'auto',
                            maxWidth: 250,
                            paddingHorizontal: 10,
                            paddingVertical: 8,
                        }
                    }
                });
            }

            if (reconnectInterval.current) {
                clearInterval(reconnectInterval.current);
                reconnectInterval.current = null;
            }

            didReconnect.current = true;
        };

        ws.onclose = (event) => {
            console.log("WebSocket соединение закрыто:", event);

            if (!isUnmounted.current && !reconnectInterval.current) {
                Toast.show({
                    type: 'error',
                    text1: 'Соединение потеряно',
                    text2: 'Пробуем переподключиться...',
                    visibilityTime: 2000,
                    position: 'top',
                    topOffset: 50,
                    props: {
                        style: {
                            alignSelf: 'flex-end',
                            width: 'auto',
                            maxWidth: 250,
                            paddingHorizontal: 10,
                            paddingVertical: 8,
                        }
                    }
                });

                reconnectInterval.current = setInterval(() => {
                    console.log("Попытка переподключения...");
                    connect();
                }, 3000);
            }
        };

        ws.onerror = (error) => {
            console.log("Ошибка WebSocket:", error);
            ws.close();
        };
    };

    useEffect(() => {
        isUnmounted.current = false;
        connect();

        return () => {
            isUnmounted.current = true;
            if (reconnectInterval.current) {
                clearInterval(reconnectInterval.current);
            }
            if (socket) {
                socket.close(1000, "Компонент размонтирован, соединение закрыто");
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
