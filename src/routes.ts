import { Application } from 'express';
import PagamentoController from './controllers/PagamentoController';
import PagamentoRepository from './repositories/PagamentoRepository';

export class Routes {
    private app: Application;
    private BASE_URL = "/api"

    constructor(app: Application) {
        this.app = app;
        this.setupRoutes();
    }

    private setupRoutes() {
        const pagamentoRepository = new PagamentoRepository();
        const pagamentoController = new PagamentoController(pagamentoRepository);

        this.app.post(`${this.BASE_URL}/pagamentos`, pagamentoController.createPagamento.bind(pagamentoController));
        this.app.get(`${this.BASE_URL}/pagamentos/:idPagamento`, pagamentoController.getPagamentoPorIdPagamento.bind(pagamentoController));
        this.app.get(`${this.BASE_URL}/pedidos/:idPedido/pagamentos`, pagamentoController.getPagamentoPorIdPedido.bind(pagamentoController));
        this.app.post(`${this.BASE_URL}/pagamentos/webhook/:idPagamento`, pagamentoController.createPagamento);
    }
}
