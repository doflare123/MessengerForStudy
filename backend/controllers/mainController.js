const User = require('../models/users');
const Contact = require('../models/contacts');
const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });

exports.GetDialods = async (req, res) =>{
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ error: "Token is required" });
    }

    try {
        // Расшифровываем токен
        const decoded = jwt.verify(token, process.env.Secret_key_Jwt);
        const userId = decoded.id;

        // Находим все контакты пользователя
        const contacts = await Contact.findAll({
            where: {
                [Op.or]: [{ user_id: userId }, { contact_id: userId }]
            }
        });

        // Получаем список ID собеседников
        const userIds = contacts.map(contact => 
            contact.user_id === userId ? contact.contact_id : contact.user_id
        );

        if (userIds.length === 0) {
            return res.status(200).json({ dialogs: [] });
        }

        // Ищем последние сообщения с каждым собеседником
        const dialogs = await Promise.all(userIds.map(async (contactId) => {
            const lastMessage = await Message.findOne({
                $or: [
                    { sender_id: String(userId), receiver_id: String(contactId) },
                    { sender_id: String(contactId), receiver_id: String(userId) }
                ]
            }).sort({ data: -1 }).limit(1);

            const contact = await User.findByPk(contactId, { attributes: ['id', 'username', 'email'] });

            return {
                contact: contact ? { id: contact.id, username: contact.username, email: contact.email } : null,
                lastMessage: lastMessage ? {
                    sender_id: lastMessage.sender_id,
                    receiver_id: lastMessage.receiver_id,
                    message_content: lastMessage.message_content,
                    data: lastMessage.data,
                    status: lastMessage.status
                } : null
            };
        }));

        res.status(200).json({ dialogs });

    } catch (error) {
        console.error("JWT verification error:", error);
        res.status(403).json({ error: "Истекший токен или невалидный" });
    }
}


exports.GetMessages = async (req, res) =>{

}

exports.SearchUser = async (req, res) =>{
    
}

exports.SentMessege = async (req, res) =>{
    
}