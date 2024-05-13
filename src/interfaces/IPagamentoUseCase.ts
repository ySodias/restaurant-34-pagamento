import { NovoPagamentoDTO } from "../models/dtos/NovoPagamentoDTO";
import { PagamentoDTO } from "../models/dtos/PagamentoDTO";
import { UpdateStatusPagamentoDTO } from "../models/dtos/UpdateStatusPagamentoDTO";

export interface IPagamentoUseCase {
    executeCreation(novoPagamento: NovoPagamentoDTO): Promise<PagamentoDTO>;
    executeGetPagamentoPorIdPagamento(idPagamento: string): Promise<PagamentoDTO>;
    executeGetPagamentoPorIdPedido(idPedido: string): Promise<PagamentoDTO[]>;
    executeUpdateStatusPagamento(updateStatusPedidoDTO: UpdateStatusPagamentoDTO): Promise<PagamentoDTO>
}