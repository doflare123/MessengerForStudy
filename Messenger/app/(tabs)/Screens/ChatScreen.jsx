import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign.js';
import Icon2 from 'react-native-vector-icons/Entypo.js';
import EmojiModal from 'react-native-emoji-modal';
import styles from '../../Styles/Styles.js';
import { useNavigation } from '@react-navigation/native';

export default function ChatScreen({ route }) {
    const [lightStyle, setLight] = useState(true);
    const { id, name } = route.params;
    const [messages, setMessages] = useState([
        { id: 1, text: 'Привет, дурак!', isUser: false },
        { id: 2, text: 'Ты че обзываешься, я маме пожалуюсь!', isUser: true },
        { id: 3, text: 'И может даже пойду в полицию, поэтому ходи и бойся теперь', isUser: true },
        { id: 4, text: 'У меня папа прокурор', isUser: false }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const navigation = useNavigation();
    const inputRef = useRef(null);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setShowEmojiPicker(false); // Закрываем эмодзи при появлении клавиатуры
        });

        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);

    const sendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { id: messages.length + 1, text: newMessage, isUser: true }]);
            setNewMessage('');
        }
    };

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
                                <TouchableOpacity onPress={() => navigation.goBack()}>
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
                        <EmojiModal
                            onEmojiSelected={(emoji) => setNewMessage(prev => prev + emoji)}
                            containerStyle={{ height: 250,alignItems: 'center' }}
                            modalStyle={{ justifyContent: 'center', alignItems: 'center' }}
                        />
                    )}
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
