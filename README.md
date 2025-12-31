# Hono Server

Минимальный сервер на Hono с API для управления пользователями.

## Локальная разработка

```bash
npm install
npm run dev
```

Сервер будет доступен на `http://localhost:3000`

## API Endpoints

- `GET /api/users` - получить всех пользователей
- `POST /api/users` - создать нового пользователя

Пример POST запроса:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

## Деплой на Render.com

1. Создайте новый Web Service на Render.com
2. Подключите ваш Git репозиторий
3. Настройки:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. Render автоматически определит порт из переменной окружения `PORT`

Данные сохраняются в файл `users.json` (временное хранилище).

