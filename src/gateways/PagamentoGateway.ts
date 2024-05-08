import { IPagamentoGateway } from "../interfaces/IPagamentoGateway";
import { IPagamentoRepository } from "../interfaces/IPagamentoRepository";
import { PagamentoModel } from "../models/Pagamento.model";
import { NovoPagamentoDTO } from "../models/dtos/NovoPagamentoDTO";

export class PagamentoGateway implements IPagamentoGateway {

    constructor(private pagamentoRepository: IPagamentoRepository) {}

    async createPagamento(novoPagamento: NovoPagamentoDTO): Promise<PagamentoModel> {
        return await this.pagamentoRepository.createPagamento(novoPagamento);
    }

    async getPagamentoPorIdPagamento(idPagamento: string): Promise<PagamentoModel | null> {
        return await this.pagamentoRepository.getPagamentoPorIdPagamento(idPagamento);
    }

    async getPagamentoPorIdPedido(idPedido: string): Promise<PagamentoModel[] | null> {
        return await this.pagamentoRepository.getPagamentoPorIdPedido(idPedido);
    }
}
