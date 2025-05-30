import React, { useState, useEffect } from 'react';
import { 
    Text, TextInput, TouchableOpacity, StyleSheet, View, KeyboardAvoidingView, 
    TouchableWithoutFeedback, Keyboard, Platform, Modal, Dimensions, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../Styles/Styles.js';
import { useNavigation } from '@react-navigation/native';
import { useWebSocket } from '@/WebSoket/WSConnection';
import { useTheme } from '../../../ThemeContext.js';

export default function VerifyScreen({ route }) {
    const socket = useWebSocket();
    const { isLight, toggleTheme } = useTheme();
    const lightStyle = isLight;
    const [loadingText, setLoadingText] = useState(".");
    const [code, setCode] = useState();
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const navigation = useNavigation();
    const [errorMessage, setErrorMessage] = useState("");

    const email = route.params.email;
    const session = route.params.session;

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingText(prev => (prev === '.' ? '. .' : prev === '. .' ? '. . .' : '.'));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (timer > 0) {
            const countdown = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(countdown);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleResend = () => {
        setTimer(30);
        setCanResend(false);
    };

    const handleSend = () => {
        const message = {
            type: 'checkCodeForgive',
            code: code,
            sessionId: session,
        };

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));

            socket.onmessage = async (event) => {
                const response = JSON.parse(event.data); // Парсим полученные данные
                
                if (response.success){
                    setErrorMessage("");
                    navigation.replace("ForgotPswd", {email, session});
                }
                else
                    setErrorMessage("Неверный код");
            };
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={-250}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={[lightStyle ? styles.lightBg : styles.darkBg]}>
                    <View style={[styles.headerView, { flex: Platform.OS === 'android' ? 0.75 : 0.6, justifyContent: 'flex-end' }]}>
                        <Text style={[lightStyle ? styles.headerLight : styles.headerDark, { fontSize: 30, marginBottom: -40 }]}>Код подтверждения</Text>
                        <Text style={[lightStyle ? styles.headerLight : styles.headerDark, { fontSize: 60, marginBottom: -40 }]}>{loadingText}</Text>
                    </View>
                    <View style={{ flex: 1.5, marginTop: 80, paddingLeft: 60, paddingRight: 60 }}>
                        <Text style={[lightStyle ? styles.lightTextBg : styles.darkTextBg, lstyles.underText]}>
                            Введите код подтверждения из письма, отправленного на почту {email}
                        </Text>
                        <TextInput
                            style={[lightStyle ? styles.lightBorderInput : styles.darkBorderInput, {marginTop: 10}]}
                            value={code}
                            placeholder="Код подтверждения"
                            onChangeText={setCode}
                        />
                         {errorMessage ? <Text style={{color: 'red', textAlign: 'center', marginTop: 10}}>{errorMessage}</Text> : null}
                        <View style={{ marginTop: 5 }}>
                            {canResend ? (
                                <TouchableOpacity onPress={handleResend}>
                                    <Text style={styles.lightResendActive}>Отправить повторно</Text>
                                </TouchableOpacity>
                            ) : (
                                <Text style={styles.lightResend}>Запросить повторно через {timer} секунд</Text>
                            )}
                        </View>
                        <View style={[styles.viewEnd, {marginTop: Platform.OS === 'ios' ? 200 : 0}]}>                            
                            <TouchableOpacity style={[lstyles.sendBtn, lightStyle ? styles.lightBtn : styles.darkBtn]} onPress={handleSend}>
                                <Text style={[lightStyle ? styles.lightText : styles.darkText, {fontSize: 30}]}>Продолжить</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flex: Platform.OS === 'android' ? 1 : 0.85, paddingLeft: 60, paddingRight: 60 }}>
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
    underText: {
        fontSize: 12
    },
    link: {
        color: '#3089FF',
        textDecorationLine: 'underline',
    },
    sendBtn: {
        width: 275,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
});