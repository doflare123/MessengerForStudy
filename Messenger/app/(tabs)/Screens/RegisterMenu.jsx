import React, { useState } from 'react';
import { 
    Text, TextInput, TouchableOpacity, StyleSheet, View, KeyboardAvoidingView, 
    TouchableWithoutFeedback, Keyboard, Platform, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import styles from '../../Styles/Styles.js';

export default function RegisterScreen() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [isSecure, setSecure] = useState(true);
    const [lightStyle, setLight] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalText, setModalText] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigation = useNavigation();

    const handleSecureChange = () => {
        setSecure(!isSecure);
    };

    const openModal = (text) => {
        setModalText(text);
        setModalVisible(true);
    };

    const handleRegister = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (name.trim() === "" || password.trim() === "" || !emailPattern.test(email)) {
            setErrorMessage("Заполните все поля корректно");
            return;
        }
        setErrorMessage("");
        navigation.navigate("Verify", { name, email, password });
    };

    return (
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={-250}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={[lightStyle ? styles.lightBg : styles.darkBg, {paddingLeft: 60, paddingRight: 60}]}>                    
                    <View style={[styles.headerView, {flex: Platform.OS === 'android' ? 0.75 : 0.6, justifyContent: 'flex-end'}]}>
                        <Text style={[lightStyle ? styles.headerLight : styles.headerDark, {fontSize: 38, marginBottom: 20}]}>Регистрация</Text>
                    </View>
                    <View style={{flex: 1.5}}>
                        <TextInput
                            style={lightStyle ? styles.lightBorderInput : styles.darkBorderInput}
                            value={name}
                            placeholder="Введите имя"
                            onChangeText={setName}
                        />
                        <TextInput
                            style={lightStyle ? styles.lightBorderInput : styles.darkBorderInput}
                            value={email}
                            placeholder="Введите почту"
                            keyboardType="email-address"
                            onChangeText={setEmail}
                        />
                        <View style={{position: "relative", flex: 1}}>
                            <TextInput
                                style={[lightStyle ? styles.lightBorderInput : styles.darkBorderInput]}
                                value={password}
                                placeholder="Введите пароль"
                                secureTextEntry={isSecure}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={handleSecureChange}>
                                <Icon name={isSecure ? 'eye-off' : 'eye'} size={24} color="#00000" style={{position: "absolute", right: 20, top: -37}}/>
                            </TouchableOpacity>
                        </View>
                        {errorMessage ? <Text style={{color: 'red', textAlign: 'center', marginTop: 10}}>{errorMessage}</Text> : null}
                        <View style={[styles.viewEnd, {marginTop: Platform.OS === 'ios' ? 200 : 0}]}>                            
                            <TouchableOpacity style={[lstyles.regBtn, lightStyle ? styles.lightBtn : styles.darkBtn]} onPress={handleRegister}>
                                <Text style={[lightStyle ? styles.lightText : styles.darkText, {fontSize: 30}]}>Регистрация</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flex: Platform.OS === 'android' ? 1 : 0.85}}>
                        <View style={styles.companyLineView}>
                            <View style={[styles.horizontalLine, {marginTop: 60}]}></View>
                            <Text style={[lightStyle ? styles.lightTextBg : styles.darkTextBg, lstyles.underText]}>
                                При создании аккаунта вы соглашаетесь с условиями{' '}
                                <Text style={[lstyles.link, lstyles.underText]} onPress={() => openModal("Пользовательское соглашение")}>Пользовательского соглашения</Text>{' '}
                                и{' '}
                                <Text style={[lstyles.link, lstyles.underText]} onPress={() => openModal("Политики конфиденциальности")}>Политики конфиденциальности</Text>.
                            </Text>
                        </View>
                        <View style={styles.viewEnd}>
                            <Text style={lightStyle ? styles.companyLight : styles.companyDark}>©Necrodwarf</Text>
                        </View>
                    </View>
                    
                    {/* Модальное окно */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={modalStyles.modalContainer}>
                            <View style={modalStyles.modalView}>
                                <Text style={modalStyles.modalText}>{modalText}</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={modalStyles.closeButton}>
                                    <Text style={modalStyles.closeButtonText}>Закрыть</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
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
    regBtn: {
        width: 275,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

const modalStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center'
    },
    modalText: {
        fontFamily: "Montserrat",
        fontSize: 16,
        marginBottom: 20
    },
    closeButton: {
        backgroundColor: '#3089FF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16
    }
});
