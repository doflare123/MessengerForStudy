const { User } = require('../models/users');  // Импорт модели User
const { Contact } = require('../models/contacts');  // Импорт модели Contact

const getContactsByUserId = async (userId) => {
    return await Contact.findAll({
        where: {
        user_id: userId,
        },
        include: [
        {
            model: User,  
            as: 'contact', 
            attributes: ['id', 'username'], 
        }
        ],
    });
};

