import { IPagamentoRepository } from "../interfaces/IPagamentoRepository";
import PagamentoRepository from "../repositories/PagamentoRepository";
import Pagamento from "../models/Pagamento.model";
import { NovoPagamentoDTO } from "../models/dtos/NovoPagamentoDTO";
import { PagamentoDTO } from "../models/dtos/PagamentoDTO";
import { TipoPagamento } from "../models/enums/TipoPagamento";

describe("PagamentoRepository", () => {
    let pagamentoRepository: IPagamentoRepository;

    beforeAll(async () => {
        pagamentoRepository = new PagamentoRepository();
        await Pagamento.collection.deleteMany();
    });

    afterAll(async () => {
        jest.clearAllMocks();
        await Pagamento.collection.deleteMany();
    });

    it("deve criar um pagamento com sucesso", async () => {
        const novoPagamento: NovoPagamentoDTO = {
            idPedido: 1,
            valor: 10.0,
            tipoPagamento: TipoPagamento.CARTAO_CREDITO
        };

        const pagamentoCriado: PagamentoDTO = await pagamentoRepository.createPagamento(novoPagamento);

        expect(pagamentoCriado).toBeDefined();
        expect(pagamentoCriado.idPedido).toEqual(1);
        expect(pagamentoCriado.valor).toEqual(10);
    });

    it("deve retornar o pagamento caso encontre por idPagamento", async () => {
        const novoPagamento: NovoPagamentoDTO = {
            idPedido: 1,
            valor: 10.0,
            tipoPagamento: TipoPagamento.CARTAO_DEBITO
        };
        const pagamentoCriado: PagamentoDTO = await pagamentoRepository.createPagamento(novoPagamento);

        const pagamentoBuscado: any = await pagamentoRepository.getPagamentoPorIdPagamento(pagamentoCriado.idPagamento as string);

        expect(pagamentoBuscado).toBeDefined();
    });

    it("deve retornar o pagamento caso encontre por idPedido", async () => {
        const pagamento1: NovoPagamentoDTO = {
            idPedido: 2,
            valor: 10.0,
            tipoPagamento: TipoPagamento.CARTAO_DEBITO
        };
        const pagamento2: NovoPagamentoDTO = {
            idPedido: 2,
            valor: 10.0,
            tipoPagamento: TipoPagamento.CARTAO_DEBITO
        };
        const pagamento3: NovoPagamentoDTO = {
            idPedido: 3,
            valor: 10.0,
            tipoPagamento: TipoPagamento.CARTAO_DEBITO
        };

        await pagamentoRepository.createPagamento(pagamento1);
        await pagamentoRepository.createPagamento(pagamento2);
        await pagamentoRepository.createPagamento(pagamento3);

        const pagamentos: any = await pagamentoRepository.getPagamentoPorIdPedido("2");

        expect(pagamentos).toBeDefined();
        expect(pagamentos).toHaveLength(2);
    });
});