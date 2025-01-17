import React, { StyleSheet } from 'react-native';

export default StyleSheet.create({
    lightBtn: {
        borderRadius: 30,
        backgroundColor: "#186FE1",
    },
    lightText: {
        fontFamily: "Montserrat",
        color: "#F5F8FF",
    },
    lightTextBg: {
        fontFamily: "Montserrat",
        color: "#214D87",
        opacity: 0.6,
    },
    lightBg: {
        flex: 1,
        backgroundColor: "#F4F5F5",
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
});