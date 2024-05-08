import { IPagamentoRepository } from "../../interfaces/IPagamentoRepository";
import Pagamento from "../../models/Pagamento.model";
import { NovoPagamentoDTO } from "../../models/dtos/NovoPagamentoDTO";
import PagamentoRepository from "../../repositories/PagamentoRepository";

const mockPagamentoRepository: IPagamentoRepository = new PagamentoRepository();

jest.spyOn(mockPagamentoRepository, "createPagamento")
    .mockImplementation(async (novoPagamento: NovoPagamentoDTO) => {
        return await Pagamento.create(novoPagamento);
    });

jest.spyOn(mockPagamentoRepository, "getPagamentoPorIdPagamento")
    .mockImplementation(async (idPagamento: string) => {
        return await Pagamento.findById(idPagamento);
    });

jest.spyOn(mockPagamentoRepository, "getPagamentoPorIdPedido")
    .mockImplementation(async (idPedido: string) => {
        return await Pagamento.find({ idPedido: idPedido });
    });

export default mockPagamentoRepository;