import { config } from "dotenv";
import { Hono } from "hono";
import type { Context } from "hono";
import { serve } from "@hono/node-server";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";

// Load environment variables
config();

const app = new Hono();

// Middleware для установки правильной кодировки и CORS для localhost
app.use("*", async (c, next) => {
  // Разрешаем запросы с localhost (добавьте порты/хосты по необходимости)
  const origin = c.req.header("origin") || "";
  const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4321",
    "http://127.0.0.1:4321",
    "https://astro-start-production.up.railway.app",
  ];

  if (allowedOrigins.includes(origin)) {
    c.header("Access-Control-Allow-Origin", origin);
  }

  c.header("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT,DELETE,OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

  // Preflight — возвращаем те же CORS-заголовки
  if (c.req.method === "OPTIONS") {
    const preflightHeaders: Record<string, string> = {
      "Access-Control-Allow-Methods": "GET,HEAD,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    };

    if (origin) {
      preflightHeaders["Access-Control-Allow-Origin"] = origin;
      preflightHeaders["Vary"] = "Origin";
    }

    return new Response(null, { status: 204, headers: preflightHeaders });
  }

  await next();
  c.header("Content-Type", "application/json; charset=utf-8");
});

const USERS_FILE = "users.json";

// Load users from file
async function loadUsers() {
  try {
    if (existsSync(USERS_FILE)) {
      const data = await readFile(USERS_FILE, "utf-8");
      return JSON.parse(data);
    } else {
      const initialUsers: any[] = [];
      await writeFile(
        USERS_FILE,
        JSON.stringify(initialUsers, null, 2),
        "utf-8",
      );
      return initialUsers;
    }
  } catch (error) {
    console.error("Error loading users:", error);
    return [];
  }
}

// Save users to file
async function saveUsers(users: any[]) {
  try {
    await writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving users:", error);
  }
}

// In-memory storage for users
let users: any[] = [
  {
    id: 1,
    name: "Дима Красавчик",
  },
  {
    id: 2,
    name: "Ден Всемогущий",
  },
];

// Root route
app.get("/", (c: Context) => {
  return c.json({
    message:
      "Дим привет! Что делать будем? Я тут API развернул корявый немного, но работает.",
    version: "1.0.0",
    endpoints: {
      "GET /api/users": "Get all users",
      "POST /api/users": "Create a new user",
    },
  });
});

// GET all users
app.get("/api/users", (c: Context) => {
  return c.json(users);
});

// POST create new user
app.post("/api/users", async (c: Context) => {
  try {
    const body = await c.req.json();
    const { name, email, age } = body;

    if (!name || !email) {
      return c.json({ error: "Name and email are required" }, 400);
    }

    const newUser = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      name,
      email,
      age: age || null,
    };

    users.push(newUser);
    await saveUsers(users);
    return c.json(newUser, 201);
  } catch (error) {
    return c.json({ error: "Invalid JSON" }, 400);
  }
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Initialize users on startup
loadUsers().then((loadedUsers) => {
  // users = loadedUsers;
  console.log(`Loaded ${users.length} users from ${USERS_FILE}`);
  console.log(`Server is running on port ${port}`);

  serve({
    fetch: app.fetch,
    port,
  });
});
