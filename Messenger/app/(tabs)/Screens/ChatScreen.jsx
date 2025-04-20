import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign.js';
import Icon2 from 'react-native-vector-icons/Entypo.js';
import EmojiModal from 'react-native-emoji-modal';
import styles from '../../Styles/Styles.js';
import { useNavigation } from '@react-navigation/native';
import { useWebSocket } from '@/WebSoket/WSConnection';
import { decodeJwt, GetToken} from '../../../JwtTokens/JwtStorege.js';

export default function ChatScreen({ route }) {
    const socket = useWebSocket();
    const [lightStyle, setLight] = useState(true);
    const { id, name } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [decoded, setDecoded] = useState(false);

    const navigation = useNavigation();
    const inputRef = useRef(null);

    const [JwtToken, setJwtToken] = useState(); 
    
    const addMessage = (text, isUser) => {
        setMessages([...messages, { id: Date.now(), text: text, isUser: isUser }]);
    };

    useEffect(() => {
        const fetchToken = async () => {
            const token = await GetToken();
            setJwtToken(token);
            
        };

        fetchToken();
    }, []);

    useEffect(() => {
        if (JwtToken) {
            try {
                const decoded = decodeJwt(JwtToken);

                socket.send(JSON.stringify({ type: 'registerС', userId: decoded.email }));

                const message = {
                    type: 'AllMesseges',
                    JwtToken: JwtToken,
                    contactEmail: id,
                };
        
                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify(message));
        
                    socket.onmessage = async (event) => {
                        const response = JSON.parse(event.data); // Парсим полученные данные
                        
                        if (response.success){
                            const newMessages = response.data.messages.map((element, index) => {
                                const text = element.message_content;
                                const isUser = element.sender_name == decoded.username;

                                return { id: Date.now() + index, text: text, isUser: isUser };
                            });
                        
                            setMessages(newMessages);
                        }
                        
                    };
                }
        
            } catch (error) {
                console.error("Ошибка при получении токена: ", error);
            }
        }
    }, [socket, JwtToken]);  

    const sendMessage = () => {
        if (newMessage.trim()) {

            const message = {
                type: 'NewMessage',
                JwtToken: JwtToken,
                messageContent: newMessage,
                contactEmail: id,
            };
    
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(message));
            }

            setMessages([...messages, { id: Date.now(), text: newMessage, isUser: true }]);
            setNewMessage('');
        }
    };

    const handleMessage = useCallback(async (event) => {
        try {
            const response = JSON.parse(event.data);
            if (response.success) {
                if (response.type === 'NewMessage') {
                    // Добавляем новое сообщение в состояние
                    const newMessage = {
                        id: Date.now(),
                        isUser: response.data.sender,
                        text: response.data.text,
                    };
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                }
            } else {
                Alert.alert('Ошибка', response.message);
            }
        } catch (error) {
            console.error('Ошибка при обработке сообщения:', error, event.data);
        }
    }, []);

    useEffect(() => {
        if (socket) {
            socket.addEventListener('message', handleMessage);
            return () => {
                socket.removeEventListener('message', handleMessage);
            };
        }
    }, [socket, handleMessage]); 

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={20}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView
                    style={[lightStyle ? styles.lightBg : styles.darkBg, { flex: 1 }]}
                    edges={Platform.OS === 'ios' ? ['left', 'right', 'bottom'] : undefined}
                >
                    <View style={{ height: 60 }}>
                        <View style={{ height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => navigation.replace("Dialogs")}>
                                    <Icon name={'arrowleft'} size={45} style={[lightStyle ? styles.lightMsgEmoji : styles.darkMsgEmoji, { marginLeft: 10 }]} />
                                </TouchableOpacity>
                            </View>
                            <Text style={[lightStyle ? styles.headerLight : styles.headerDark, { fontSize: 30, marginLeft: 20 }]}>{name}</Text>
                            <View style={{ flex: 1}}/>
                        </View>
                        <View style={[styles.horizontalLine, { marginTop: 5, backgroundColor: '#186FE1', opacity: 0.6, height: 2 }]}></View>
                    </View>
                    <FlatList
                        data={messages}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={[item.isUser ? (lightStyle ? styles.lightMsgUserBg : styles.darkMsgUserBg) : (lightStyle ? styles.lightMsgBg : styles.darkMsgBg), { alignSelf: item.isUser ? 'flex-end' : 'flex-start', padding: 10, borderRadius: 15, margin: 5 }]}>
                                <Text style={item.isUser ? (lightStyle ? styles.lightMsgUser : styles.darkMsgUser) : (lightStyle ? styles.lightMsg : styles.darkMsg)}>{item.text}</Text>
                            </View>
                        )}
                    />
                    <View style={[lightStyle ? styles.lightMsgFoot : styles.darkMsgFoot, { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1 }]}>
                        <View style={[lightStyle ? styles.lightMsgInBg : styles.darkMsgInBg, { flex: 1, borderRadius: 20, paddingHorizontal: 10, height: 40, flexDirection: 'row', alignItems: 'center' }]}>
                            <TextInput 
                                ref={inputRef}
                                style={[lightStyle ? styles.lightMsgInput : styles.darkMsgInput, { flex: 1 }]}
                                placeholder='Напишите сообщение...'
                                value={newMessage}
                                onChangeText={setNewMessage}
                                keyboardType='default'
                            />
                            <TouchableOpacity onPress={() => setShowEmojiPicker(!showEmojiPicker)}>
                                <Icon2 name='emoji-happy' size={24} style={[lightStyle ? styles.lightMsgEmoji : styles.darkMsgEmoji, { marginLeft: 10 }]} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={sendMessage} style={{ marginLeft: 10 }}>
                            <Icon name='arrowup' size={24} style={lightStyle ? styles.lightMsgEmoji : styles.darkMsgEmoji} />
                        </TouchableOpacity>
                    </View>
                    
                    {/* Эмодзи-панель */}
                    {showEmojiPicker && (
                        <View style={{height: 200}}>
                            <EmojiModal
                                onEmojiSelected={(emoji) => setNewMessage(prev => prev + emoji)}
                                containerStyle={[lightStyle ? styles.lightMsgEmojiBg : styles.darkMsgEmojiBg, { height: '100%',alignItems: 'center', borderRadius: 0 }]}
                                modalStyle={{ justifyContent: 'center', alignItems: 'center', marginBottom: -60 }}
                            />
                        </View>
                        
                    )}
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
