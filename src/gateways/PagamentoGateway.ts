import { NovoPagamentoDTO } from "../models/dtos/NovoPagamentoDTO";
import PagamentoRepository from "../repositories/PagamentoRepository";
import { PagamentoModel } from "@/models/Pagamento.model";

export class PagamentoGateway {
    private pagamentoRepository: PagamentoRepository;
    
    constructor(pagamentoRepository: PagamentoRepository) {
        this.pagamentoRepository = pagamentoRepository;
    }

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
