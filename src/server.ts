import express from 'express';
import cors from 'cors';
import "dotenv/config";
import * as swaggerDocument from './swagger.json';
import swaggerUi from 'swagger-ui-express';
import { Routes } from './routes';
import { connectToMongoDB, disconnectFromMongoDB } from "./infra/database/mongodb";

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
        this.app.use(cors());
    }

    private configureRoutes(): void {
        try {
            new Routes(this.app);
        } catch (e) {
            console.error("Erro a criar rotas -> ", e)
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
const app = server.app;
// export default { app };
module.exports = {app}
server.start();