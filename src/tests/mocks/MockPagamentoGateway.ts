import { PagamentoGateway } from "../../gateways/PagamentoGateway";
import { IPagamentoGateway } from "../../interfaces/IPagamentoGateway";
import { NovoPagamentoDTO } from "../../models/dtos/NovoPagamentoDTO";
import mockPagamentoRepository from "./MockPagamentoRepository";

const mockPagamentoGateway: IPagamentoGateway = new PagamentoGateway(mockPagamentoRepository);

jest.spyOn(mockPagamentoGateway, "createPagamento")
    .mockImplementation(async (novoPagamento: NovoPagamentoDTO) => {
        return mockPagamentoRepository.createPagamento(novoPagamento);
    });

jest.spyOn(mockPagamentoGateway, "getPagamentoPorIdPagamento")
    .mockImplementation(async (idPagamento: string) => {
        return mockPagamentoRepository.getPagamentoPorIdPagamento(idPagamento);
    });

jest.spyOn(mockPagamentoGateway, "getPagamentoPorIdPedido")
    .mockImplementation(async (idPedido: string) => {
        return mockPagamentoRepository.getPagamentoPorIdPedido(idPedido);
    });

export default mockPagamentoGateway;