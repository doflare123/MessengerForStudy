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

    const handleEmailChange = (text) => {
        setEmail(text);
    };

    const handlePswdChange = (text) => {
        setPassword(text);
    };
    
    const handleSecureChange = () => {
        setSecure(!isSecure);
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
                <SafeAreaView style={[styles.lightBg, {paddingLeft: 60, paddingRight: 60}]}>
                    <View style={styles.headerView}>
                        <Text style={styles.headerLight}>Вход</Text>
                    </View>
                    <View style={{flex: 1.5}}>
                        <TextInput
                            style={styles.lightBorderInput}
                            value={email}
                            placeholder="Введите почту"
                            keyboardType="email-address"
                            onChangeText={handleEmailChange}
                            contentInset={{ top: 0, left: 10, bottom: 0, right: 10 }}
                        />
                        <View style={{position: "relative", flex: 1}}>
                            <TextInput
                                style={[styles.lightBorderInput]}
                                value={password}
                                secureTextEntry={true}
                                onChangeText={handlePswdChange}
                            />
                            <TouchableOpacity onPress={handleSecureChange}>
                                <Icon name={isSecure ? 'eye-off' : 'eye'} size={24} color="#00000" style={{position: "absolute", right: 20, top: -37}}/>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity>
                            <Text style={[styles.lightTextBg, {fontSize: 15, marginTop: 0, textAlign: 'right'}]}>Забыли пароль?</Text>
                        </TouchableOpacity>
                        <View style={styles.viewEnd}>
                            <TouchableOpacity style={[lstyles.enterBtn, styles.lightBtn]}>
                                <Text style={[styles.lightText, {fontSize: 30}]}>Войти</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flex: 1}}>
                        <View style={styles.companyLineView}>
                            <View style={[styles.horizontalLine, {marginTop: 60}]}></View>
                            <TouchableOpacity>
                                <Text style={[styles.lightTextBg, {fontSize: 18}]}>Зарегистрироваться</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.viewEnd}>
                            <Text style={styles.companyLight}>©Necrodwarf</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const lstyles = StyleSheet.create({
    inputTextInput: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    enterBtn: {
        width: 250,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
});
