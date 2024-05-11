import { IPagamentoRepository } from "../interfaces/IPagamentoRepository";
import Pagamento, { PagamentoModel } from "../models/Pagamento.model";
import { NovoPagamentoDTO } from "../models/dtos/NovoPagamentoDTO";
import { UpdateStatusPagamentoDTO } from "../models/dtos/UpdateStatusPagamentoDTO";

export default class PagamentoRepository implements IPagamentoRepository {

    async createPagamento(novoPagamento: NovoPagamentoDTO): Promise<PagamentoModel> {
        return await Pagamento.create(novoPagamento);
    }

    async getPagamentoPorIdPagamento(idPagamento: string): Promise<PagamentoModel | null> {
        return await Pagamento.findById(idPagamento);
    }

    async getPagamentoPorIdPedido(idPedido: string): Promise<PagamentoModel[] | null> {
        return await Pagamento.find({ idPedido: idPedido });
    }

    async updateStatusPagamento(updateStatusPagamentoDTO: UpdateStatusPagamentoDTO): Promise<PagamentoModel | null> {
        return await Pagamento.findOneAndUpdate({
            _id: updateStatusPagamentoDTO.idPagamento
        }, {
            statusPagamento: updateStatusPagamentoDTO.statusPagamento
        },
            { new: true });
    }
}
