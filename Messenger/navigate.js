import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import { createStackNavigator} from '@react-navigation/stack';
import LoginMenu from './app/(tabs)/Screens/LoginMenu';
import RegisterMenu from './app/(tabs)/Screens/RegisterMenu';
import CodeVerify from './app/(tabs)/Screens/CodeVerify';
import Dialogs from './app/(tabs)/Screens/DialogsMenu';
import Profile from './app/(tabs)/Screens/ProfileMenu';
import ForgotEmail from './app/(tabs)/Screens/ForgotEmail';
import ForgotCode from './app/(tabs)/Screens/ForgotCode';
import ForgotPswd from './app/(tabs)/Screens/ForgotPswd';
import ChatScreen from './app/(tabs)/Screens/ChatScreen';
import Toast from 'react-native-toast-message';

import { WebSocketProvider } from './WebSoket/WSConnection';
import { ThemeProvider } from './ThemeContext'; // путь к файлу
// import { WebSocketProvider } from './WebSoket/WSConnection';


const Stack = createStackNavigator();

export default function Navigator() {
    return (
        <WebSocketProvider>
            <ThemeProvider>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Authorization"
                        component={LoginMenu}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Registration"
                        component={RegisterMenu}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Verify"
                        component={CodeVerify}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Dialogs"
                        component={Dialogs}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Profile"
                        component={Profile}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="ForgotPswd"
                        component={ForgotPswd}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="ForgotCode"
                        component={ForgotCode}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="ForgotEmail"
                        component={ForgotEmail}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Chat"
                        component={ChatScreen}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
                <Toast />
            </ThemeProvider>
        </WebSocketProvider>
    );
}

const styles = StyleSheet.create({
    but: {
        marginLeft: 5,
        marginTop: -15,
        fontSize: 40,
    },
    backButton: {
        marginLeft: 10,
        marginTop: -10,
    },
});
