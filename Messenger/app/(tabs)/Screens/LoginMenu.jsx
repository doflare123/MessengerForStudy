import React, { useRef, useCallback, useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert, View, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather.js';
//import { useWebSocket } from '@/WebSoket/WSConnection';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../../Styles/Styles.js';

export default function LoginScreen({ navigation }) {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [isSecure, setSecure] = useState(true);
    const [lightStyle, setLight] = useState(true);

    const handleEmailChange = (text) => {
        setEmail(text);
    };

    const handlePswdChange = (text) => {
        setPassword(text);
    };
    
    const handleSecureChange = () => {
        setSecure(!isSecure);
    };

    const toRegisterScreen = () => {
        navigation.navigate("Registration");
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
                        <Text style={lightStyle ? styles.headerLight : styles.headerDark}>Вход</Text>
                    </View>
                    <View style={{flex: 1.5, paddingLeft: 60, paddingRight: 60}}>
                        <TextInput
                            style={lightStyle ? styles.lightBorderInput : styles.darkBorderInput}
                            value={email}
                            placeholder="Введите почту"
                            keyboardType="email-address"
                            onChangeText={handleEmailChange}
                        />
                        <View style={{position: "relative", flex: 1}}>
                            <TextInput
                                style={[lightStyle ? styles.lightBorderInput : styles.darkBorderInput]}
                                value={password}
                                placeholder="Введите пароль"
                                secureTextEntry={isSecure}
                                onChangeText={handlePswdChange}
                            />
                            <TouchableOpacity onPress={handleSecureChange}>
                                <Icon name={isSecure ? 'eye-off' : 'eye'} size={24} color="#00000" style={{position: "absolute", right: 20, top: -37}}/>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity>
                            <Text style={[lightStyle ? styles.lightTextBg : styles.darkTextBg, {fontSize: 15, marginTop: Platform.OS === 'android' ? -60 : 0, textAlign: 'right'}]}>Забыли пароль?</Text>
                        </TouchableOpacity>
                        <View style={styles.viewEnd}>
                            <TouchableOpacity style={[lstyles.enterBtn, lightStyle ? styles.lightBtn : styles.darkBtn]}>
                                <Text style={[lightStyle ? styles.lightText : styles.darkText, {fontSize: 30}]}>Войти</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flex: 1, paddingLeft: 60, paddingRight: 60}}>
                        <View style={styles.companyLineView}>
                            <View style={[styles.horizontalLine, {marginTop: 60}]}></View>
                            <TouchableOpacity onPress={toRegisterScreen}>
                                <Text style={[lightStyle ? styles.lightTextBg : styles.darkTextBg, {fontSize: 18}]}>Зарегистрироваться</Text>
                            </TouchableOpacity>
                        </View>
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
