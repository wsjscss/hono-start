import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";

interface User {
    id: number;
    name: string;
    email?: string;
    age?: number;
}

let users: User[] = [
    {
        id: 1,
        name: "Дима Хитрый",
    },
    {
        id: 2,
        name: "Den TheMighty",
    },
];

const app = new Hono();

app.use(
    "*",
    cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:4321",
            "https://astro-start-production.up.railway.app",
        ],
    }),
);

app.get("/", (c) =>
    c.json({
        message: "Дим привет! API работает на ElysiaJS",
        version: "1.0.0",
        endpoints: {
            "GET /api/users": "Get all users",
            "POST /api/users": "Create a new user",
        },
    }),
);
app.get("/api/users", (c) => c.json(users));

const port = parseInt(process.env.PORT || "3000");
serve({
    fetch: app.fetch,
    port,
});

console.log(`💕 Server running on port ${port}`);
