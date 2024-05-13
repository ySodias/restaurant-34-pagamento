import { StatusPagamento } from "../enums/StatusPagamento";

export interface UpdateStatusPagamentoDTO {
    idPagamento: string;
    statusPagamento: StatusPagamento;
}