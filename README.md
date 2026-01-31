# ElysiaJS Server

Минимальный сервер на ElysiaJS (работает на Bun).

## Установка и запуск

```bash
bun install
bun run dev
```

## API

- `GET /` - информация о сервере
- `GET /api/users` - получить всех пользователей
- `POST /api/users` - создать нового пользователя

### Пример

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Иван","email":"ivan@example.com","age":25}'
```

