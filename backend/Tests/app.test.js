const request = require('supertest');
const app = require('../app'); // Путь к вашему серверу
const User = require('../models/users');
const { validatePassword } = require('../utils/crypt');
const CreateJWT = require('../utils/Create_jwt');

jest.mock('../models/users'); // Мокаем модель User
jest.mock('../utils/crypt'); // Мокаем функции для работы с паролями
jest.mock('../utils/Create_jwt'); // Мокаем функцию для создания JWT

describe('POST /api/EnterAccount', () => {
    it('успешная аутентификация', async () => {
        // Мок данных пользователя
        const mockUser = {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            password_hash: 'hashedpassword',
            salt: 'randomsalt',
        };

        // Настройка mock'ов
        User.findOne.mockResolvedValue(mockUser); // Мок функции поиска пользователя
        validatePassword.mockReturnValue(true); // Мок валидации пароля
        CreateJWT.mockReturnValue('mocked_jwt'); // Мок создания JWT

        const response = await request(app)
            .post('/api/EnterAccount')
            .send({
                email: 'test@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ jwt: 'mocked_jwt' });
        expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
        expect(validatePassword).toHaveBeenCalledWith('password123', 'hashedpassword', 'randomsalt');
        expect(CreateJWT).toHaveBeenCalledWith(1, 'testuser', 'test@example.com');
    });

    it('неправильный email или пароль', async () => {
        User.findOne.mockResolvedValue(null); // Пользователь не найден

        const response = await request(app)
            .post('/api/EnterAccount')
            .send({
                email: 'wrong@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Invalid email or password' });
        expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'wrong@example.com' } });
    });

    it('ошибка при валидации пароля', async () => {
        const mockUser = {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            password_hash: 'hashedpassword',
            salt: 'randomsalt',
        };

        User.findOne.mockResolvedValue(mockUser);
        validatePassword.mockReturnValue(false); // Пароль не прошёл валидацию

        const response = await request(app)
            .post('/api/EnterAccount')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword',
            });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Invalid email or password' });
        expect(validatePassword).toHaveBeenCalledWith('wrongpassword', 'hashedpassword', 'randomsalt');
    });

    it('ошибка сервера', async () => {
        User.findOne.mockRejectedValue(new Error('Database error')); // Исключение из базы данных

        const response = await request(app)
            .post('/api/EnterAccount')
            .send({
                email: 'test@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal Server Error' });
    });
});
