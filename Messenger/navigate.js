import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import { createStackNavigator} from '@react-navigation/stack';
import LoginMenu from './app/(tabs)/Screens/LoginMenu';
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
