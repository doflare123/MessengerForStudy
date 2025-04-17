import React, { useRef, useCallback, useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert, View, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather.js';
//import { useWebSocket } from '@/WebSoket/WSConnection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useWebSocket } from '@/WebSoket/WSConnection';

import styles from '../../Styles/Styles.js';

export default function LoginScreen({ route }) {
    const socket = useWebSocket();
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [lightStyle, setLight] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const navigation = useNavigation();

    const { email } = route.params || {};

    const handlePswd2Change = (text) => {
        setPassword2(text);
    };

    const handlePswdChange = (text) => {
        setPassword(text);
    };
    
    const toLoginScreen = () => {
        if (password!=password2) {
            setErrorMessage("Заполните все поля корректно");
            return;
        }
        setErrorMessage("");

        const message = {
            type: 'ChangePassFogive',
            email: email,
            newPswd: password,
        };

        console.log("email", email)
        
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        }

        navigation.navigate("Authorization");
    }
    
    return (
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={-250} // смещение клавиатуры
        >
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss} // скрытие клавиатуры при нажатии вне TextInput
            >
                <SafeAreaView style={[lightStyle ? styles.lightBg : styles.darkBg]}>
                    <View style={styles.headerView}>
                        <Text style={[lightStyle ? styles.headerLight : styles.headerDark, {fontSize: 45}]}>Смена пароля</Text>
                    </View>
                    <View style={{flex: 1.5, paddingLeft: 60, paddingRight: 60}}>
                        <TextInput
                            style={lightStyle ? styles.lightBorderInput : styles.darkBorderInput}
                            value={password}
                            placeholder="Введите пароль"
                            onChangeText={handlePswdChange}
                        />
                        {errorMessage ? <Text style={{color: 'red', textAlign: 'center', marginTop: 10}}>{errorMessage}</Text> : null}
                        <TextInput
                            style={[lightStyle ? styles.lightBorderInput : styles.darkBorderInput]}
                            value={password2}
                            placeholder="Повторите пароль"
                            onChangeText={handlePswd2Change}
                        />
                        {errorMessage ? <Text style={{color: 'red', textAlign: 'center', marginTop: 10}}>{errorMessage}</Text> : null}
                        <View style={styles.viewEnd}>
                            <TouchableOpacity style={[lstyles.enterBtn, lightStyle ? styles.lightBtn : styles.darkBtn]} onPress={toLoginScreen}>
                                <Text style={[lightStyle ? styles.lightText : styles.darkText, {fontSize: 30}]}>Сменить</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flex: 1, paddingLeft: 60, paddingRight: 60}}>
                        <View style={styles.viewEnd}>
                            <Text style={lightStyle ? styles.companyLight : styles.companyDark}>©Necrodwarf</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const lstyles = StyleSheet.create({
    enterBtn: {
        width: 250,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
});
