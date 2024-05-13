import { Application } from 'express';
import PagamentoController from './controllers/PagamentoController';
import PagamentoRepository from './repositories/PagamentoRepository';
import { PagamentoGateway } from './gateways/PagamentoGateway';
import PagamentoUseCase from './useCases/PagamentoUseCase';

export class Routes {
    private app: Application;
    private BASE_URL = "/api"

    constructor(app: Application) {
        this.app = app;
        this.setupRoutes();
    }

    private setupRoutes() {
        const pagamentoRepository = new PagamentoRepository();
        const pagamentoGateway = new PagamentoGateway(pagamentoRepository);
        const pagamentoUseCase = new PagamentoUseCase(pagamentoGateway);
        const pagamentoController = new PagamentoController(pagamentoUseCase);

        this.app.post(`${this.BASE_URL}/pagamentos`, pagamentoController.createPagamento.bind(pagamentoController));
        this.app.get(`${this.BASE_URL}/pagamentos/:idPagamento`, pagamentoController.getPagamentoPorIdPagamento.bind(pagamentoController));
        this.app.get(`${this.BASE_URL}/pedidos/:idPedido/pagamentos`, pagamentoController.getPagamentoPorIdPedido.bind(pagamentoController));
        this.app.patch(`${this.BASE_URL}/pagamentos/webhook/:idPagamento`, pagamentoController.updateStatusPagamento.bind(pagamentoController));
    }
}
