import React, { useState, useEffect } from 'react';
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

export default function DialogsScreen({ route }) {
    const [lightStyle, setLight] = useState(true);
    const [messages, setMessages] = useState([]);
    const navigation = useNavigation();

    const addMessage = (avatarImg, name, lastMsg, lastTime, id) => {
        const newMessage = { id, avatarImg, name, lastMsg, lastTime };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    const toProfile = (id) => {
        navigation.replace("Profile");
    };


    const toDialog = (id, name) => {
        console.log("Открытие диалога с ID:", id);
        navigation.replace("Chat", { id, name });
    };

    useEffect(() => {
        addMessage(require("../../../assets/images/avatar_example.jpg"), "Roma SS", "Hello my friend!", "04:30", 1);
        addMessage(require("../../../assets/images/avatar_example.jpg"), "Satoru Gojo", "Прибыл Годжо Сатору", "20:31", 2);
    }, []);

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
                                            <Image source={item.avatarImg} style={styles.avatar} />
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
