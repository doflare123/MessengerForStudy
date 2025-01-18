const request = require('supertest');
const app = require('../App');
const nodemailer = require('nodemailer');
const Session = require('../models/session_model');
const connection = require('../database'); 
jest.setTimeout(10000);

// Мокируем отправку почты
jest.mock('nodemailer');
jest.mock('../models/session_model');

beforeAll(async () => {
  await connection.sync(); // Подключение и синхронизация базы данных
});

afterAll(async () => {
  // Закрываем соединение с базой данных или завершаем другие асинхронные операции
  if (connection && connection.close) {
    await connection.close();
  }
});

describe('POST /api/CreateSession', () => {
  it('должен создать новую сессию и отправить письмо с кодом подтверждения', async () => {
    // Мокаем метод create в модели Session
    const createSessionMock = jest.spyOn(Session, 'create').mockResolvedValue({
      // проверка на строки
      SessionId: expect.any(String),  
      CodeConfirm: expect.any(String), 
    });

    // Мокаем метод sendMail в nodemailer
    const sendMailMock = jest.fn().mockResolvedValue({
      response: '250 OK',
    });
    nodemailer.createTransport.mockReturnValue({
      sendMail: sendMailMock,
    });

    // Выполняем запрос к API
    const response = await request(app)
      .get('/api/CreateSession')
      .query({ email: 'test@example.com' });

    // Проверка, что сессия была создана
    expect(createSessionMock).toHaveBeenCalled();
    expect(createSessionMock).toHaveBeenCalledWith(expect.objectContaining({
      //  снова проверка строк
      SessionId: expect.any(String),  
      CodeConfirm: expect.any(String), 
    }));

    // Проверка, что email был отправлен
    expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
      from: process.env.messege_email,
      to: 'test@example.com',
      subject: 'Ваш код подтверждения',
      text: expect.stringContaining('Ваш код подтверждения: '),  // Проверяем, что код подтверждения присутствует в тексте
    }));

    expect(response.status).toBe(200);
    expect(response.body.sessionId).toBeDefined();  // Проверяем, что sessionId не пустой
  });

  it('должен вернуть ошибку, если при создании сессии произошла ошибка', async () => {
    // Мокаем ошибку при создании сессии
    const createSessionMock = jest.spyOn(Session, 'create').mockRejectedValue(new Error('Ошибка базы данных'));

    const response = await request(app)
      .get('/api/CreateSession')
      .query({ email: 'test@example.com' });

    expect(createSessionMock).toHaveBeenCalled();
    expect(response.status).toBe(500); // Ожидаем 500 ошибку
    expect(response.body.message).toBe('При создании сессии произошла ошибка');
  });

  it('должен вернуть ошибку, если email не предоставлен', async () => {
    const response = await request(app)
      .get('/api/CreateSession');

    expect(response.status).toBe(500); // Ожидаем 500 ошибку
    expect(response.body.message).toBe('При создании сессии произошла ошибка');
  });
});

describe('POST /api/CheckSession', () => {
  it('должен успешно проверить сессию с правильным кодом подтверждения', async () => {
    // Мокаем метод findOne в модели Session
    const findOneMock = jest.spyOn(Session, 'findOne').mockResolvedValue({
      SessionId: '123456',
      CodeConfirm: 654321,
    });

    const response = await request(app)
      .post('/api/CheckSession')
      .send({
        sessionId: '123456',
        code: '654321',
      });

    expect(findOneMock).toHaveBeenCalledWith({
      where: { SessionId: '123456' },
    });
    expect(response.status).toBe(200);
  });

  it('должен вернуть ошибку, если сессия не найдена', async () => {
    // Мокаем метод findOne, чтобы он вернул null
    const findOneMock = jest.spyOn(Session, 'findOne').mockResolvedValue(null);

    const response = await request(app)
      .post('/api/CheckSession')
      .send({
        sessionId: '123456',
        code: '654321',
      });

    expect(findOneMock).toHaveBeenCalledWith({
      where: { SessionId: '123456' },
    });
    expect(response.status).toBe(404);  // Ожидаем ошибку 404
    expect(response.body.message).toBe('Сессия не найдена');
  });

  it('должен вернуть ошибку, если код подтверждения неверный', async () => {
    // Мокаем метод findOne, чтобы он нашел сессию с неправильным кодом
    const findOneMock = jest.spyOn(Session, 'findOne').mockResolvedValue({
      SessionId: '123456',
      CodeConfirm: 654321,
    });

    const response = await request(app)
      .post('/api/CheckSession')
      .send({
        sessionId: '123456',
        code: '111111', // Неверный код
      });

    expect(findOneMock).toHaveBeenCalledWith({
      where: { SessionId: '123456' },
    });
    expect(response.status).toBe(400);  // Ожидаем ошибку 400
    expect(response.body.message).toBe('Неверный код подтверждения');
  });

  it('должен вернуть ошибку 500 при ошибке сервера', async () => {
    // Мокаем метод findOne, чтобы он вызвал ошибку
    const findOneMock = jest.spyOn(Session, 'findOne').mockRejectedValue(new Error('Ошибка базы данных'));

    const response = await request(app)
      .post('/api/CheckSession')
      .send({
        sessionId: '123456',
        code: '654321',
      });

    expect(findOneMock).toHaveBeenCalled();
    expect(response.status).toBe(500);  // Ожидаем ошибку 500
    expect(response.body.message).toBe('При проверке сессии произошла ошибка на сервере');
  });
});
