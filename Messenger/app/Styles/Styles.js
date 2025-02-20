import React, { StyleSheet } from 'react-native';

export default StyleSheet.create({
    lightBtn: {
        borderRadius: 30,
        backgroundColor: "#186FE1",
        justifyContent: 'center',
        alignItems: 'center'
    },
    lightText: {
        fontFamily: "Montserrat",
        color: "#F5F8FF",
    },
    lightName: {
        fontFamily: "Montserrat",
        color: "#000000",
    },
    lightTextBg: {
        fontFamily: "Montserrat",
        color: "#214D87",
        opacity: 0.6,
    },
    lightTextBg2: {
        fontFamily: "Montserrat",
        color: "#186FE1",
    },
    lightBg: {
        flex: 1,
        backgroundColor: "#F4F5F5",
    },
    lightInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DFDFDF',
        backgroundColor: "#DFDFDF",
        borderRadius: 20,
        width: '80%',
        height: 40,
        paddingHorizontal: 5,
        placeholderTextColor: "#000000",
        paddingLeft: 10
    },
    lightDelete: {
        fontFamily: "Montserrat",
        color: "#D70000",
    },


    darkBtn: {
        backgroundColor: '#F5F8FF',

    },

    lightBorderInput: {
        borderRadius: 30,
        borderWidth: 2,
        height: 50,
        paddingLeft: 15,
        marginTop: 30,
        borderColor: "#186FE1",
        backgroundColor: "#DFDFDF",
    },

    headerLight: {
        fontFamily: "MontserratBold",
        fontSize: 70,
        color: "#186FE1",
    },
    headerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    companyLineView: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    viewEnd: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    companyLight: {
        color: '#214D87',
        fontFamily: "Montserrat",
        opacity: 0.2,
    },

    horizontalLine: {
        height: 1, // Толщина линии
        backgroundColor: '#214D87', // Цвет линии
        width: '100%', // Ширина линии (можно указать процентами или конкретным числом)
        marginVertical: 10, // Отступы сверху и снизу (опционально)
    },


    
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        justifyContent: 'space-between',
    },
    scrollContainer: {
        paddingBottom: 20, // Добавляем немного отступа снизу для удобства
    },
    modalText: {
        fontSize: 16,
        color: 'black',
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },


    lightResend: {
        fontSize: 14,
        color: 'gray'
    },
    lightResendActive: {
        fontSize: 14,
        color: '#3089FF',
        textDecorationLine: 'underline'
    },



    avatar: {
        width: 75,  // Размер картинки
        height: 75, // Размер картинки
        borderRadius: 50,  // Круглая форма картинки
    }
});