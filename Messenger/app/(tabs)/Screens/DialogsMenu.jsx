import React, { useState, useEffect, useRef } from 'react';
import { 
    Text, TextInput, TouchableOpacity, StyleSheet, View, KeyboardAvoidingView, 
    TouchableWithoutFeedback, Keyboard, Platform, FlatList, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../Styles/Styles.js';
import Icon from 'react-native-vector-icons/AntDesign.js';
import Icon2 from 'react-native-vector-icons/Entypo.js';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { useWebSocket } from '@/WebSoket/WSConnection';
import { decodeJwt, GetToken} from '../../../JwtTokens/JwtStorege.js';

export default function DialogsScreen({ route }) {
    const socket = useWebSocket();
    const [lightStyle, setLight] = useState(true);
    const [messages, setMessages] = useState([]);
    const navigation = useNavigation();
    const [messagesBackup, setMessagesBackup] = useState([]);
    const [searchValue, setSearch] = useState("");

    const addMessage = (avatarImg, name, lastMsg, lastTime, id) => {
        const newMessage = { id, avatarImg, name, lastMsg, lastTime };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    const clearMessage = () => {
        setMessages([]);
    };

    const restoreMessages = () => {
        if(messagesBackup){
            clearMessage();
            setMessages(messagesBackup);
        };
    };

    const toProfile = (id) => {
        navigation.replace("Profile");
    };

    const hs = async (text) => {
        setSearch(text);
    };

    const [first, setFirst] = useState(true);
    const handleSearch = async () => {
        if (!searchValue.trim()) {
            if(first)
                setFirst(false);
            else
                restoreMessages();
                
            return;
        }
        try {
            const message = {
                type: 'SearchUser',
                searchQuery: searchValue,
            };
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(message));

                socket.onmessage = async (event) => {
                    const response = JSON.parse(event.data); // Парсим полученные данные
                    
                    if (response.success){
                        clearMessage();
                        response.data.users.forEach(element => {
                            const avatar = element.avatar;
                            const name = element.username;

                            const email = element.email;
                            addMessage(avatar, name, "", "", email);
                        });
                    }
                };
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(() => {
        const timerId = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => clearTimeout(timerId);
    }, [searchValue]);


    const toDialog = (id, name) => {
        console.log("Открытие диалога с ID:", id);
        navigation.replace("Chat", { id, name });
    };

    const [JwtToken, setJwtToken] = useState(); 

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
                const message = {
                    type: 'Alldialogs',
                    JwtToken: JwtToken,
                };
        
                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify(message));
        
                    socket.onmessage = async (event) => {
                        const response = JSON.parse(event.data); // Парсим полученные данные
                        
                        if (response.success){
                            const newMessages = response.data.map(element => {
                                const avatar = element.contact.avatar;
                                const name = element.contact.username;
                                const msg = element.lastMessage.message_content;
                        
                                const date = new Date(element.lastMessage.time);
                                const time = date.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false,
                                });
                        
                                const email = element.contact.email;
                        
                                return { id: email, avatarImg: avatar, name, lastMsg: msg, lastTime: time };
                            });
                        
                            setMessages(newMessages);
                            setMessagesBackup(newMessages);
                        }
                        
                    };
                }
        
        
                //addMessage(require("../../../assets/images/avatar_example.jpg"), "Roma SS", "Hello my friend!", "04:30", 1);
                //addMessage(require("../../../assets/images/avatar_example.jpg"), "Satoru Gojo", "Прибыл Годжо Сатору", "20:31", 2);
            } catch (error) {
                console.error("Ошибка при получении токена: ", error);
            }
        }
    }, [JwtToken]);  

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={-250}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView
                    style={[lightStyle ? styles.lightBg : styles.darkBg, { flex: 1 }]}
                    edges={Platform.OS === 'ios' ? ['left', 'right', 'bottom'] : undefined}
                >
                    <View style={{ height: 80 }}>
                        <View style={{ height: 60, flexDirection: 'row', alignItems: 'center' }}>
                            <Icon2 name={'menu'} size={45} color="#186FE1" style={{ marginLeft: 10 }} onPress={toProfile} />
                            <Text style={[lightStyle ? styles.headerLight : styles.headerDark, { fontSize: 30, marginLeft: 20 }]}>Диалоги</Text>
                            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }}>
                                <TextInput 
                                    style={[lightStyle ? styles.lightInput : styles.darkInput, {height:"100%"}]} 
                                    placeholder="🔍Поиск" 
                                    placeholderTextColor="#888" 
                                    textAlign="left" 
                                    value={searchValue}
                                    onChangeText={hs}
                                />
                            </View>
                        </View>
                        <View style={[styles.horizontalLine, { marginTop: 5, backgroundColor: '#186FE1', opacity: 0.6, height: 2 }]}></View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={messages}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => toDialog(item.id, item.name)}>
                                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                        <View style={{ flex: 1.75, justifyContent: 'flex-start', flexDirection: 'row' }}>
                                            <Image source={{uri: item.avatarImg}} style={styles.avatar} />
                                            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                                <Text style={[lightStyle ? styles.lightName : styles.darkName, { fontSize: 20, marginLeft: 5 }]}>{item.name}</Text>
                                                <Text style={[lightStyle ? styles.lightName : styles.darkName, { fontSize: 14, marginLeft: 5, opacity: 0.7 }]}>{item.lastMsg}</Text>
                                            </View>
                                        </View>
                                        <View style={{ width: 100, justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                                            <Text style={[lightStyle ? styles.lightName : styles.darkName, { fontSize: 13, marginRight: 10, marginTop: 10, opacity: 0.7 }]}>{item.lastTime}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}


const lstyles = StyleSheet.create({
    underText: {
        fontSize: 12
    },
    link: {
        color: '#3089FF',
        textDecorationLine: 'underline',
    },
    resendText: {
        fontSize: 14,
        color: 'gray'
    },
    resendTextActive: {
        fontSize: 14,
        color: '#3089FF',
        textDecorationLine: 'underline'
    },
    sendBtn: {
        width: 275,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
});
