import React, { useRef, useCallback, useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert, View, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather.js';
//import { useWebSocket } from '@/WebSoket/WSConnection';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../../Styles/Styles.js';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [lightStyle, setLight] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const handleEmailChange = (text) => {
        setEmail(text);
    };

    const toLoginScreen = () => {
        navigation.goBack();
    }

    const toForgotCodeScreen = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setErrorMessage("Заполните все поля корректно");
            return;
        }
        setErrorMessage("");
        navigation.navigate("ForgotCode", { email });
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
                            value={email}
                            placeholder="Введите почту"
                            keyboardType="email-address"
                            onChangeText={handleEmailChange}
                        />
                        {errorMessage ? <Text style={{color: 'red', textAlign: 'center', marginTop: 10}}>{errorMessage}</Text> : null}
                        <View style={[styles.viewEnd, {marginTop: 60}]}>
                            <TouchableOpacity style={[lstyles.enterBtn, lightStyle ? styles.lightBtn : styles.darkBtn]} onPress={toForgotCodeScreen}>
                                <Text style={[lightStyle ? styles.lightText : styles.darkText, {fontSize: 30}]}>Продолжить</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={toLoginScreen}>
                                <Text style={[lightStyle ? styles.lightText : styles.darkText, {fontSize: 25, color:"#8A8B8C", marginTop: 20}]}>Назад</Text>
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
