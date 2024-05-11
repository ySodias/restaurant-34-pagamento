import { IPagamentoGateway } from "../interfaces/IPagamentoGateway";
import { IPagamentoRepository } from "../interfaces/IPagamentoRepository";
import { PagamentoModel } from "../models/Pagamento.model";
import { NovoPagamentoDTO } from "../models/dtos/NovoPagamentoDTO";
import { UpdateStatusPagamentoDTO } from "../models/dtos/UpdateStatusPagamentoDTO";

export class PagamentoGateway implements IPagamentoGateway {

    constructor(private pagamentoRepository: IPagamentoRepository) { }

    async createPagamento(novoPagamento: NovoPagamentoDTO): Promise<PagamentoModel> {
        return await this.pagamentoRepository.createPagamento(novoPagamento);
    }

    async getPagamentoPorIdPagamento(idPagamento: string): Promise<PagamentoModel | null> {
        return await this.pagamentoRepository.getPagamentoPorIdPagamento(idPagamento);
    }

    async getPagamentoPorIdPedido(idPedido: string): Promise<PagamentoModel[] | null> {
        return await this.pagamentoRepository.getPagamentoPorIdPedido(idPedido);
    }

    async updateStatusPagamento(updateStatusPagamentoDTO: UpdateStatusPagamentoDTO): Promise<PagamentoModel | null> {
        return await this.pagamentoRepository.updateStatusPagamento(updateStatusPagamentoDTO);
    }
}
