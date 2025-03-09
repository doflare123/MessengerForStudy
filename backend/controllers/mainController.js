const User = require('../models/users');
const Contact = require('../models/contacts');
const Messege = require('../models/messages');
const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
// const WebSocketServer = require('../websocket');

exports.GetDialods = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    try {
        const decoded = jwt.verify(token, process.env.Secret_key_Jwt);
        const userId = decoded.id;
        console.log(123);

        try {
            const contacts = await Contact.findAll({
                where: {
                    [Op.or]: [{ user_id: userId }, { contact_id: userId }]
                }
            });

            console.log(1234);

            const userIds = contacts.map(contact => 
                contact.user_id === userId ? contact.contact_id : contact.user_id
            );

            if (userIds.length === 0) {
                return res.status(200).json({ dialogs: [] });
            }

            const dialogs = await Promise.all(userIds.map(async (contactId) => {
                const lastMessage = await Message.findOne({
                    $or: [
                        { sender_id: String(userId), receiver_id: String(contactId) },
                        { sender_id: String(contactId), receiver_id: String(userId) }
                    ]
                }).sort({ data: -1 }).limit(1);

                const contact = await User.findByPk(contactId, { attributes: ['id', 'username', 'email'] });

                return {
                    contact: contact ? { username: contact.username, email: contact.email } : null,
                    lastMessage: lastMessage ? {
                        sender_id: lastMessage.sender_id,
                        receiver_id: lastMessage.receiver_id,
                        message_content: lastMessage.message_content,
                        data: lastMessage.data,
                        status: lastMessage.status
                    } : null
                };
            }));

            return res.status(200).json({ dialogs });

        } catch (error) {
            return res.status(200).json({ msg: "Диалогов пока нет" });
        }

    } catch (error) {
        return res.status(403).json({ error: "Истекший токен или невалидный" });
    }
};


exports.GetMessages = async (req, res) => {
    const { contactEmail } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    try {
        const decoded = jwt.verify(token, process.env.Secret_key_Jwt);
        const senderEmail = decoded.email;

        const sender = await User.findOne({ where: { email: senderEmail } });
        const contact = await User.findOne({ where: { email: contactEmail } });

        if (!sender || !contact) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const messages = await Messege.find({
            $or: [
                { sender_id: sender.id, receiver_id: contact.id },
                { sender_id: contact.id, receiver_id: sender.id }
            ]
        }).sort({ time: -1 });

        res.status(200).json({ messages });
    } catch (error) {
        console.warn(error);
        res.status(500).json({ message: 'Произошла ошибка на сервере' });
    }
};

exports.SearchUser = async (req, res) => {
    const { searchQuery } = req.body; 

    if (!searchQuery) {
        return res.status(400).json({ message: 'Параметр поиска не предоставлен' });
    }

    try {
        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { username: { [Op.like]: `%${searchQuery}%` } }
                ]
            },
            attributes: ['username', 'email', 'avatar'], 
        });

        if (users.length === 0) {
            return res.status(404).json({ message: 'Пользователи не найдены' });
        }

        res.status(200).json({ users });
    } catch (error) {
        console.warn(error);
        res.status(500).json({ message: 'Произошла ошибка на сервере' });
    }
};


exports.SentMessege = async (req, res) => {
    const { messageContent, contactEmail } = req.body; 
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    try {
        const decoded = jwt.verify(token, process.env.Secret_key_Jwt);
        const senderEmail = decoded.email;

        const sender = await User.findOne({ where: { email: senderEmail } });
        const contact = await User.findOne({ where: { email: contactEmail } });

        if (!sender || !contact) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        let contactExists = await Contact.findOne({
            where: {
                [Op.or]: [
                    { user_id: sender.id, contact_id: contact.id },
                    { user_id: contact.id, contact_id: sender.id }
                ]
            }
        });

        if (!contactExists) {
            await Contact.create({
                user_id: sender.id,
                contact_id: contact.id,
            });

            await Contact.create({
                user_id: contact.id,
                contact_id: sender.id,
            });

            contactExists = true;
        }

        const newMessage = new Messege({
            sender_id: sender.id,
            receiver_id: contact.id,
            message_content: messageContent,
            data: new Date().toISOString(),
            status: false
        });

        await newMessage.save();

        // const socket = WebSocketServer.getSocketByUserId(contact.id);
        // if (socket) {
        //     socket.emit('new_message', {
        //         sender_id: sender.id,
        //         receiver_id: contact.id,
        //         message_content: messageContent,
        //         data: newMessage.data,
        //         status: newMessage.status
        //     });
        // }

        res.status(200).json({ message: 'Сообщение успешно отправлено' });

    } catch (error) {
        console.warn(error);
        res.status(500).json({ message: 'Произошла ошибка на сервере' });
    }
};
