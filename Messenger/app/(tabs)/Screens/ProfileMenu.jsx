import React, { useState, useEffect } from 'react';
import { 
    Text, TextInput, TouchableOpacity, StyleSheet, View, KeyboardAvoidingView, 
    TouchableWithoutFeedback, Keyboard, Platform, Image, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../Styles/Styles.js';
import Icon from 'react-native-vector-icons/Feather.js';
import Icon2 from 'react-native-vector-icons/Entypo.js';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useWebSocket } from '@/WebSoket/WSConnection';
import { decodeJwt, GetToken, GetAvatar} from '../../../JwtTokens/JwtStorege.js';

import { useTheme } from '../../../ThemeContext.js';

export default function DialogsScreen({ route }) {
    const { isLight, toggleTheme } = useTheme();
    const socket = useWebSocket();
    const lightStyle = isLight;
    const [avatar, setAvatar] = useState(null);
    const [userName, setName] = useState("...");
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalText, setModalText] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [inputType, setInputType] = useState(null);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

    const [JwtToken, setJwtToken] = useState(); 

    useEffect(() => {
        const fetchToken = async () => {
            const token = await GetToken();
            const ava = await GetAvatar();
            setAvatar(ava);
            setJwtToken(token);
        };

        fetchToken();
    }, []);

    useEffect(() => {
        if (JwtToken && avatar) {
            try {
                const decoded = decodeJwt(JwtToken);
                setName(decoded?.username || "Без имени");
                setAvatar(avatar || "");
            } catch (error) {
                console.error("Ошибка при получении токена: ", error);
            }
        }
    }, [JwtToken, avatar]);  
    

    const changeAvatar = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Требуется разрешение', 'Необходимо предоставить разрешение для доступа к медиатеке.');
            return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
    
        if (!result.canceled) {
            const newAvatar = result.assets[0].uri;
            setAvatar(newAvatar);
    
            const localUri = result.assets[0].uri;
            const filename = localUri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename ?? '');
            const type = match ? `image/${match[1]}` : `image`;
    
            const formData = new FormData();
            formData.append('avatar', {
                uri: localUri,
                name: filename,
                type,
            });
    
            try {
                const res = await fetch('http://10.197.33.35:8081/api/account/ChangeAvatar', {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${JwtToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formData,
                });
    
                const data = await res.json();
                if (res.ok) {
                    setAvatar(data.avatarUrl);
                    await AsyncStorage.setItem('Avatar', data.avatarUrl);
                }
            } catch (err) {
                console.error(err);
            }
        }
    };    

    const openModal = (type) => {
        setInputType(type);
        setModalText(type === 'name' ? "Введите новое имя" : "Введите новый пароль");
        setInputValue("");
        setModalVisible(true);
    };

    const saveInput = async () => {
        if (inputType === 'name') {
            setName(inputValue);
        } else {

            const message = {
                type: 'ChangePass',
                JwtToken: JwtToken,
                newPswd: inputValue,
            };
            
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(message));
            }
        }
        setModalVisible(false);
    };

    const toDialogs = () => {
        navigation.replace("Dialogs");
    };

    const exit = () => {
        navigation.replace("Authorization");
    };

    const deleteAcc = () => {
        setConfirmDeleteVisible(true); 
    };
    
    const confirmDelete = () => {
        const message = {
            type: 'DelUser',
            JwtToken: JwtToken,
        };
    
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        }
    
        setConfirmDeleteVisible(false);
        navigation.replace("Authorization");
    };    

    const handleIValueChange = (text) => {
        setInputValue(text);
    };

    const buttons = [
        { text: "Изменить аватар", onPress: changeAvatar },
        { text: "Изменить имя", onPress: () => openModal('name') },
        { text: "Изменить пароль", onPress: () => openModal('password') },
        { text: "Выйти", onPress: exit }
    ];

    const handleChangeStyle = async (text) => {
        toggleTheme();
    };

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
                    <View style={{ height: 60 }}>
                        <View style={{ height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
                                <TouchableOpacity onPress={toDialogs}>
                                    <Icon2 name={'arrow-left'} size={45} color="#186FE1" style={{ marginLeft: 10 }} />
                                </TouchableOpacity>
                            </View>
                            <Text style={[lightStyle ? styles.headerLight : styles.headerDark, { fontSize: 30, marginLeft: 20 }]}>Профиль</Text>
                            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }}>
                                <TouchableOpacity onPress={handleChangeStyle}>
                                    <Icon name={lightStyle ? 'moon' : 'sun'} size={45} style={{ marginRight: 5 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.horizontalLine, { marginTop: 5, backgroundColor: '#186FE1', opacity: 0.6, height: 2 }]}></View>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Image source={{ uri: avatar }} style={{marginTop: 15, borderRadius: 150, width: 150, height: 150}} />
                        <Text style={[lightStyle ? styles.lightTextBg2 : styles.darkTextBg2, { fontSize: 30, marginTop: 5, marginBottom: 15 }]}>{userName}</Text>
                        {buttons.map((btn, index) => (
                            <TouchableOpacity key={index} style={{ borderRadius: 60, backgroundColor: "#DFDFDF", width: 325, height: 75, alignItems: 'center', justifyContent: 'center', marginTop: 20 }} onPress={btn.onPress}>
                                <Text style={{ fontSize: 20, fontFamily: "Montserrat", color: "#343434" }}>{btn.text}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={{ flex: 0.25, justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Text style={[lightStyle ? styles.lightDelete : styles.darkDelete, { fontSize: 15, color: "#D70000" }]} onPress={deleteAcc}>Удалить аккаунт</Text>
                    </View>

                    {/* Модальное окно */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={lstyles.overlay}>
                            <View style={styles.modalView}>
                                <View style={{alignItems: 'center'}}>
                                    <Text style={styles.modalText}>{modalText}</Text>
                                </View>
                                <TextInput 
                                    style={[styles.input, lightStyle ? styles.lightInput : styles.darkInput, {marginTop: 10, width: '100%'}]} 
                                    placeholder={modalText}
                                    value={inputValue}
                                    placeholderTextColor="#888" 
                                    textAlign="left" 
                                    onChangeText={handleIValueChange}
                                />
                                <View style={lstyles.buttonContainer}>
                                    <TouchableOpacity onPress={() => setModalVisible(false)} style={[lightStyle ? styles.lightBtn : styles.darkBtn, {backgroundColor: '#D70000', width: 100, height: 40}]}>
                                        <Text style={lightStyle ? styles.lightText : styles.darkText}>Отмена</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={saveInput} style={[lightStyle ? styles.lightBtn : styles.darkBtn, {backgroundColor: '#007bff', width: 100, height: 40}]}>
                                        <Text style={lightStyle ? styles.lightText : styles.darkText}>Сохранить</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={confirmDeleteVisible}
                        onRequestClose={() => setConfirmDeleteVisible(false)}
                    >
                        <View style={lstyles.overlay}>
                            <View style={styles.modalView}>
                                <Text style={[styles.modalText, { textAlign: 'center', marginBottom: 20 }]}>
                                    Вы точно хотите удалить аккаунт?
                                </Text>
                                <View style={lstyles.buttonContainer}>
                                    <TouchableOpacity
                                        onPress={() => setConfirmDeleteVisible(false)}
                                        style={[lightStyle ? styles.lightBtn : styles.darkBtn, { backgroundColor: '#888', width: 100, height: 40 }]}
                                    >
                                        <Text style={lightStyle ? styles.lightText : styles.darkText}>Отмена</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={confirmDelete}
                                        style={[lightStyle ? styles.lightBtn : styles.darkBtn, { backgroundColor: '#D70000', width: 100, height: 40 }]}
                                    >
                                        <Text style={lightStyle ? styles.lightText : styles.darkText}>Удалить</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const lstyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10
    },
});