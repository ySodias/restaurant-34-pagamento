import { PagamentoModel } from "../models/Pagamento.model";
import { NovoPagamentoDTO } from "../models/dtos/NovoPagamentoDTO";
import { UpdateStatusPagamentoDTO } from "../models/dtos/UpdateStatusPagamentoDTO";

export interface IPagamentoGateway {
    createPagamento(novoPagamento: NovoPagamentoDTO): Promise<PagamentoModel>;
    getPagamentoPorIdPagamento(idPagamento: string): Promise<PagamentoModel | null>;
    getPagamentoPorIdPedido(idPedido: string): Promise<PagamentoModel[] | null>;
    updateStatusPagamento(updateStatusPagamentoDTO: UpdateStatusPagamentoDTO): Promise<PagamentoModel | null>;
}