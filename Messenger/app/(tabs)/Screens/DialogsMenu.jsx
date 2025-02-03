import React, { useState, useEffect } from 'react';
import { 
    Text, TextInput, TouchableOpacity, StyleSheet, View, KeyboardAvoidingView, 
    TouchableWithoutFeedback, Keyboard, Platform, Modal, Image, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../Styles/Styles.js';
import Icon from 'react-native-vector-icons/AntDesign.js';
import Icon2 from 'react-native-vector-icons/Entypo.js';

export default function VerifyScreen({ route }) {
    const [lightStyle, setLight] = useState(true);
    

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={-250}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={[lightStyle ? styles.lightBg : styles.darkBg]}>
                    <View style={{ height: 60 }}>
                        <View style={{ height: 50, flexDirection: 'row' }}>
                            <Icon2 name={'menu'} size={45} color="#186FE1" style={{marginLeft: 10}}/>
                            <Text style={[lightStyle ? styles.headerLight : styles.headerDark, {fontSize: 30, marginLeft: 20}]}>Диалоги</Text>
                            <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row'}}>
                                <TextInput style={[lightStyle ? styles.lightInput : styles.darkInput]} placeholder="🔍Поиск" placeholderTextColor="#888" textAlign="left"/>
                                {/* <Icon name={'search1'} size={24} color="#00000"/> */}
                            </View>
                        </View>
                        <View style={[styles.horizontalLine, { marginTop: 5, backgroundColor: '#186FE1', opacity: 0.6, height: 2 }]}></View>
                    </View>
                    <View style={{ flex: 1}}>
                        <ScrollView contentContainerStyle={styles.scrollContainer}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flex: 1.75, justifyContent: 'flex-start', flexDirection: 'row'}}>
                                    <Image 
                                        source={require('../../../assets/images/avatar_example.jpg')}  // Использование require без объекта
                                        style={styles.avatar}
                                    />
                                    <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                                        <Text style={[lightStyle ? styles.lightName : styles.darkName, {fontSize: 27, marginLeft: 5, marginTop: 1}]}>Крутое имя</Text>
                                        <Text style={[lightStyle ? styles.lightName : styles.darkName, {fontSize: 17, marginLeft: 5, marginTop: 3, opacity: 0.7}]}>Привет дурак!</Text>
                                    </View>
                                </View>
                                <View style={{flex: 0.25, justifyContent: 'flex-start'}}>
                                    <Text style={[lightStyle ? styles.lightName : styles.darkName, {fontSize: 17, marginRight: 10, marginTop: 10, opacity: 0.7}]}>20:31</Text>
                                </View>
                            </View>
                        </ScrollView>
                        
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