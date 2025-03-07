# Vkgramm

<!-- Буква V -->

<path d="M50 130 L100 50 L150 130" stroke="white" stroke-width="15" stroke-linecap="round" stroke-linejoin="round" fill="none"/>

<!-- Самолетик -->

<img title="" src="file:///C:/Users/ABOBUS/Documents/Study/mob/MessengerForStudy/ТЗ/IconApp.svg" alt="Vkgramm Logo" data-align="center">

## 📌 Описание

Vkgramm — это современный мессенджер, разработанный командой **Necrodwarf**. Проект включает в себя серверную часть, вебсокет-сервер, сервис верификации почты и клиентское приложение.

## 🚀 Основные функции

- 🔹 Регистрация и аутентификация пользователей
- 🔹 Отправка текстовых сообщений и файлов
- 🔹 Верификация email
- 🔹 Вебсокет-сервер для мгновенных обновлений

## 🛠️ Технологии

Проект использует следующие технологии:

- **Backend:** Node.js, Express, MongoDB
- **Backend WebSocket:** WebSocket API
- **Verification API:** Express, Nodemailer
- **Client:** React Native

## 📂 Структура репозитория

```
Vkgramm/
│── backend/          # Основной сервер
│── backendWs/        # WebSocket-сервер
│── verification_api/ # API для верификации email
│── Messenger/        # Клиентское приложение
```

## 🔧 Установка и запуск

1. **Клонировать репозиторий:**
   
   ```sh
   git clone https://github.com/your-repo/vkgramm.git
   cd vkgramm
   ```

2. **Установить зависимости:**
   
   ```sh
   cd backend && npm install
   cd ../backendWs && npm install
   cd ../verification_api && npm install
   cd ../Messenger && npm install
   ```

3. **Запуск серверов:**
   
   ```sh
   cd backend && npm start
   cd ../backendWs && npm start
   cd ../verification_api && npm start
   ```

4. **Запуск клиента:**
   
   ```sh
   cd Messenger && npx expo start
   ```

## 📸 Скриншоты

<img title="" src="file:///C:/Users/ABOBUS/Documents/Study/mob/MessengerForStudy/ТЗ/1.jpg" alt="Главный экран" data-align="center" width="168">

<img title="" src="file:///C:/Users/ABOBUS/Documents/Study/mob/MessengerForStudy/ТЗ/3.jpg" alt="3.jpg" width="172" data-align="center">

## 🏗️ Разработчики

- **Necrodwarf Team**
  
  
  
  <img title="" src="file:///C:/Users/ABOBUS/Documents/Study/mob/MessengerForStudy/ТЗ/logo.png" alt="logo.png" width="335" data-align="center">

## 📬 Контакты

✉️ [kabanchikov.adventure@gmail.com](mailto:kabanchikov.adventure@gmail.com) | 🌐 [Website](https://your-website.com/)

---

⭐ Если вам понравился проект, поставьте звезду на GitHub!
