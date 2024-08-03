import express from 'express';
import cors from 'cors';
import "dotenv/config";
import * as swaggerDocument from './swagger.json';
import swaggerUi from 'swagger-ui-express';
import { Routes } from './routes';
import { connectToMongoDB, disconnectFromMongoDB } from "./infra/database/mongodb";
import request from 'supertest';
import helmet from "helmet";
import crypto from 'crypto';
class Server {
    public app;

    private readonly PORT: number;

    constructor() {
        this.app = express();
        this.PORT = parseInt(process.env.PORT as string, 10) || 3000;
        this.configureMiddlewares();
        this.configureRoutes();
        connectToMongoDB();
        this.onDisconnect();
    }

    private configureMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        this.app.use(cors({
            origin: process.env.ORIGINS
        }));
        this.app.use((req, res, next) => {
            res.locals.nonce = crypto.randomBytes(16).toString('hex');
            next();
          });
        this.app.use((req, res, next) => {
            res.setHeader('X-Content-Type-Options', 'nosniff');
            next();
          });
        this.app.use(
            helmet.contentSecurityPolicy({
            directives: {
            defaultSrc: ["'none'"],
            scriptSrc: ["'self'", (req: any, res: any) => `'nonce-${res.locals.nonce}'`],
            styleSrc: ["'self'", 'https://fonts.googleapis.com', (req: any, res: any) => `'nonce-${res.locals.nonce}'`],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            imgSrc: ["'self'"],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
            action: "deny",
            },
        })
        );
        this.app.disable('x-powered-by');
    }

    private configureRoutes(): void {
        try {
            new Routes(this.app);
        } catch (e) {
            console.error("Erro a criar rotas -> ", e);
        }
    }

    public start(): void {
        this.app.listen(this.PORT, () => {
            console.log(`Server running on port ${this.PORT}`);
        });
    }

    private onDisconnect(): void {
        process.on('SIGINT', async () => {
            await disconnectFromMongoDB();
            process.exit(0);
        });
    }
}

const server = new Server();
server.start();
export default request(server.app);