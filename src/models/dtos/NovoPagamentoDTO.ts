import { TipoPagamento } from "../enums/TipoPagamento";

export interface NovoPagamentoDTO {
    idPedido: number;
    valor: number;
    tipoPagamento: TipoPagamento;
}