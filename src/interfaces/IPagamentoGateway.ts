import { NovoPagamentoDTO } from "../models/dtos/NovoPagamentoDTO";
import { PagamentoModel } from "../models/Pagamento.model";

export interface IPagamentoGateway {
    createPagamento(novoPagamento: NovoPagamentoDTO): Promise<PagamentoModel>;
    getPagamentoPorIdPagamento(idPagamento: string): Promise<PagamentoModel | null>;
    getPagamentoPorIdPedido(idPedido: string): Promise<PagamentoModel[] | null>;
}