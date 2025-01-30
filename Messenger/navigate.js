import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import { createStackNavigator} from '@react-navigation/stack';
import LoginMenu from './app/(tabs)/Screens/LoginMenu';
import RegisterMenu from './app/(tabs)/Screens/RegisterMenu';
import CodeVerify from './app/(tabs)/Screens/CodeVerify';
// import { WebSocketProvider } from './WebSoket/WSConnection';


const Stack = createStackNavigator();

export default function Navigator() {
    return (
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
        </Stack.Navigator>
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
