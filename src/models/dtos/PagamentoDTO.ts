import { StatusPagamento } from "../enums/StatusPagamento";
import { TipoPagamento } from "../enums/TipoPagamento";

export interface PagamentoDTO {
    idPagamento?: string;
    idPedido?: number;
    statusPagamento?: StatusPagamento;
    tipoPagamento?: TipoPagamento;
    dataPagamento?: Date;
    valor?: number;
    createdAt?: Date;
    updatedAt?: Date;
}