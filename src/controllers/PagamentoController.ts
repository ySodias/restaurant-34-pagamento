import { NovoPagamentoDTO } from "../models/dtos/NovoPagamentoDTO";
import { PagamentoGateway } from "../gateways/PagamentoGateway";
import PagamentoRepository from "../repositories/PagamentoRepository";
import { PagamentoUseCase } from "../useCases/PagamentoUseCase";
import { Response, Request } from "express";

export default class PagamentoController {

    private pagamentoGateway: PagamentoGateway;
    private pagamentoUseCase: PagamentoUseCase;

    constructor(pagamentoRepository: PagamentoRepository) {
        this.pagamentoGateway = new PagamentoGateway(pagamentoRepository);
        this.pagamentoUseCase = new PagamentoUseCase(this.pagamentoGateway);
    }

    async createPagamento(req: Request, res: Response) {
        const { idPedido, valor, tipoPagamento } = req.body;
        const novoPagamento: NovoPagamentoDTO = { idPedido, valor, tipoPagamento };

        try {
            const response = await this.pagamentoUseCase.executeCreation(novoPagamento);
            return res.status(201).json(response);
        } catch (error: any) {
            return res.status(400).json({ message: error?.message });
        }
    }

    async getPagamentoPorIdPagamento(req: Request, res: Response) {
        const { idPagamento } = req.params;

        try {
            const response = await this.pagamentoUseCase.executeGetPagamentoPorIdPagamento(idPagamento);
            return res.status(200).json(response);
        } catch (error: any) {
            return res.status(400).json({ message: error?.message });
        }
    }

    async getPagamentoPorIdPedido(req: Request, res: Response) {
        const { idPedido } = req.params;

        try {
            const response = await this.pagamentoUseCase.executeGetPagamentoPorIdPedido(idPedido);
            return res.status(200).json(response);
        } catch (error: any) {
            return res.status(400).json({ message: error?.message });
        }
    }

}
