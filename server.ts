import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { node } from "@elysiajs/node";

interface User {
    id: number;
    name: string;
    email?: string;
    age?: number;
}

const USERS_FILE = "users.json";
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

const app = new Elysia({ adapter: node() })
    .use(
        cors({
            origin: [
                "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:4321",
                "https://astro-start-production.up.railway.app",
            ],
        }),
    )
    .get("/", () => ({
        message: "Дим привет! API работает на ElysiaJS",
        version: "1.0.0",
        endpoints: {
            "GET /api/users": "Get all users",
            "POST /api/users": "Create a new user",
        },
    }))
    .get("/api/users", () => users)
    .listen(3000);

console.log(`🦊 Elysia is running at http://localhost:3000`);
