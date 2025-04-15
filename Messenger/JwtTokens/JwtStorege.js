import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from "buffer";

export const GetToken = async () => {//получение токена из хранилища
    try {
        const token = await AsyncStorage.getItem('JwtToken');
        if (token !== null) {
            return token;
        }
    } catch (error) {
        console.error('Ошибка при извлечении токена:', error);
        return null;
    }
};

export const GetUserId = async () => {//получение токена из хранилища
    try {
        const id = await AsyncStorage.getItem('_id');
        if (id !== null) {
            return id;
        }
    } catch (error) {
        console.error('Ошибка при извлечении id:', error);
    }
    return null;
};

export const GetUserName = async () =>{
    try {
        const name = await AsyncStorage.getItem('UserName');
        if(name !== null){
            return name;
        }
    } catch (error) {
        console.error('Ошибка при извлечении имени:', error);
    }
}

export const decodeJwt = (token) =>{
    try {
        const parts = token.split(".").map(part => Buffer.from(part.replace(/-/g, '+').replace(/-/g, '/'), 'base64').toString());
        const payload = JSON.parse(parts[1]);
        return payload;
    } catch (error) {
        console.log(error.message, 13);
    }
}
