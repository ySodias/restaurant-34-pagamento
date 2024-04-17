import express from 'express';
import cors from 'cors';
import * as swaggerDocument from './swagger.json';
import swaggerUi from 'swagger-ui-express';

class Server {
    private app;
    
    private readonly PORT: number;

    constructor() {
        this.app = express();
        this.PORT = parseInt(process.env.PORT as string, 10) || 3000;
        this.configureMiddlewares();
        this.configureRoutes();
    }

    private configureMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        this.app.use(cors());
    }

    private configureRoutes(): void {
        // Configurar as rotas aqui
        this.app.get('/', (req, res) => {
            res.send('Hello, world!');
        });
    }

    public start(): void {
        this.app.listen(this.PORT, () => {
            console.log(`Server running on port ${this.PORT}`);
        });
    }
}

const server = new Server();
server.start();
