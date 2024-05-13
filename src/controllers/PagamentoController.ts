import { Request, Response } from "express";
import { IPagamentoUseCase } from "../interfaces/IPagamentoUseCase";
import { NovoPagamentoDTO } from "../models/dtos/NovoPagamentoDTO";
import { UpdateStatusPagamentoDTO } from "../models/dtos/UpdateStatusPagamentoDTO";

export default class PagamentoController {

    constructor(private pagamentoUseCase: IPagamentoUseCase) { }

    async createPagamento(req: Request, res: Response) {
        const { idPedido, valor, tipoPagamento } = req.body;
        const novoPagamento: NovoPagamentoDTO = { idPedido, valor, tipoPagamento };

        try {
            const response = await this.pagamentoUseCase.executeCreation(novoPagamento);
            return res.status(201).json(response);
        } catch (error: any) {
            console.error(error)
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

    async updateStatusPagamento(req: Request, res: Response) {
        const { idPagamento } = req.params;
        const { statusPagamento } = req.body;

        const updateStatusPedidoDTO: UpdateStatusPagamentoDTO = { idPagamento, statusPagamento }

        try {
            const response = await this.pagamentoUseCase.executeUpdateStatusPagamento(updateStatusPedidoDTO);
            return res.status(200).json(response);
        } catch (error: any) {
            return res.status(400).json({ message: error?.message });
        }
    }

}
