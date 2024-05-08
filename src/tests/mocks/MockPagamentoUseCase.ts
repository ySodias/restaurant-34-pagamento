import { IPagamentoUseCase } from "../../interfaces/IPagamentoUseCase";
import { NovoPagamentoDTO } from "../../models/dtos/NovoPagamentoDTO";
import { PagamentoDTO } from "../../models/dtos/PagamentoDTO";
import PagamentoUseCase from "../../useCases/PagamentoUseCase";
import mockPagamentoGateway from "./MockPagamentoGateway";

const mockPagamentoUseCase: IPagamentoUseCase = new PagamentoUseCase(mockPagamentoGateway)

jest.spyOn(mockPagamentoUseCase, "executeCreation")
    .mockImplementation(async (novoPagamento: NovoPagamentoDTO) => {
        return mockPagamentoGateway.createPagamento(novoPagamento);
    });

jest.spyOn(mockPagamentoUseCase, "executeGetPagamentoPorIdPagamento")
    .mockImplementation(async (idPagamento: string) => {
        return mockPagamentoGateway.getPagamentoPorIdPagamento(idPagamento) as PagamentoDTO;
    });

jest.spyOn(mockPagamentoUseCase, "executeGetPagamentoPorIdPedido")
    .mockImplementation(async (idPedido: string) => {
        return mockPagamentoGateway.getPagamentoPorIdPedido(idPedido) as unknown as PagamentoDTO[];
    });

export default mockPagamentoUseCase;