import React, { useRef, useCallback, useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert, View, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather.js';
//import { useWebSocket } from '@/WebSoket/WSConnection';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../../Styles/Styles.js';

export default function RegisterScreen() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [isSecure, setSecure] = useState(true);
    const [lightStyle, setLight] = useState(true);

    const handleNameChange = (text) => {
        setName(text);
    };

    const handleEmailChange = (text) => {
        setEmail(text);
    };

    const handlePswdChange = (text) => {
        setPassword(text);
    };
    
    const handleSecureChange = () => {
        setSecure(!isSecure);
    };

    const openUserAgreement = () => {
        Alert.alert("Пользовательское соглашение");
    };
    
    const openPrivacyPolicy = () => {
        Alert.alert("Политики конфиденциальности");
    };

    return (
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={-250} // смещение клавиатуры
        >
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss} // скрытие клавиатуры при нажатии вне TextInput
            >
                <SafeAreaView style={[lightStyle ? styles.lightBg : styles.darkBg, {paddingLeft: 60, paddingRight: 60}]}>
                    <View style={[styles.headerView, {flex: Platform.OS === 'android' ? 0.75 : 0.6, justifyContent: 'flex-end'}]}>
                        <Text style={[lightStyle ? styles.headerLight : styles.headerDark, {fontSize: 38, marginBottom: 20}]}>Регистрация</Text>
                    </View>
                    <View style={{flex: 1.5}}>
                        <TextInput
                            style={lightStyle ? styles.lightBorderInput : styles.darkBorderInput}
                            value={name}
                            placeholder="Введите имя"
                            onChangeText={handleNameChange}
                        />
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
                        <View style={[styles.viewEnd, {marginTop: Platform.OS === 'ios' ? 200 : 0}]}>
                            <TouchableOpacity style={[lstyles.regBtn, lightStyle ? styles.lightBtn : styles.darkBtn]}>
                                <Text style={[lightStyle ? styles.lightText : styles.darkText, {fontSize: 30}]}>Регистрация</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flex: Platform.OS === 'android' ? 1 : 0.85}}>
                        <View style={styles.companyLineView}>
                            <View style={[styles.horizontalLine, {marginTop: 60}]}></View>
                            <Text style={[lightStyle ? styles.lightTextBg : styles.darkTextBg, lstyles.underText]}>
                                При создании аккаунта вы соглашаетесь с условиями{' '}
                                <Text style={[lstyles.link, lstyles.underText]} onPress={openUserAgreement}>
                                    Пользовательского соглашения
                                </Text>{' '}
                                и{' '}
                                <Text style={[lstyles.link, lstyles.underText]} onPress={openPrivacyPolicy}>
                                    Политики конфиденциальности
                                </Text>.
                            </Text>
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
    underText:{
        fontSize: 12
    },
    link: {
        color: '#3089FF',
        textDecorationLine: 'underline',
    },
    regBtn: {
        width: 275,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
});