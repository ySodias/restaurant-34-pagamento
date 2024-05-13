import { PagamentoGateway } from "../gateways/PagamentoGateway";
import { IPagamentoGateway } from "../interfaces/IPagamentoGateway";
import Pagamento from "../models/Pagamento.model";
import { NovoPagamentoDTO } from "../models/dtos/NovoPagamentoDTO";
import { PagamentoDTO } from "../models/dtos/PagamentoDTO";
import { UpdateStatusPagamentoDTO } from "../models/dtos/UpdateStatusPagamentoDTO";
import { StatusPagamento } from "../models/enums/StatusPagamento";
import { TipoPagamento } from "../models/enums/TipoPagamento";
import mockPagamentoRepository from "./mocks/MockPagamentoRepository";

describe("PagamentoGateway", () => {
    let pagamentoGateway: IPagamentoGateway;

    beforeAll(async () => {
        pagamentoGateway = new PagamentoGateway(mockPagamentoRepository);
        await Pagamento.collection.deleteMany();
    });

    afterAll(async () => {
        jest.clearAllMocks();
        await Pagamento.collection.deleteMany();
    });

    beforeEach(async () => {
        await Pagamento.collection.deleteMany();
    });

    it("deve criar um pagamento com sucesso", async () => {
        const novoPagamento: NovoPagamentoDTO = {
            idPedido: 1,
            valor: 10.0,
            tipoPagamento: TipoPagamento.CARTAO_CREDITO
        };

        const pagamentoCriado: PagamentoDTO = await pagamentoGateway.createPagamento(novoPagamento);

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
        const pagamentoCriado: PagamentoDTO = await pagamentoGateway.createPagamento(novoPagamento);

        const pagamentoBuscado: any = await pagamentoGateway.getPagamentoPorIdPagamento(pagamentoCriado.idPagamento as string);

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

        await pagamentoGateway.createPagamento(pagamento1);
        await pagamentoGateway.createPagamento(pagamento2);

        const pagamentos: any = await pagamentoGateway.getPagamentoPorIdPedido("2");

        expect(pagamentos).toBeDefined();
    });

    it("deve atualizar o status do pagamento de acordo com o idPagamento", async () => {
        const novoPagamento: NovoPagamentoDTO = {
            idPedido: 1,
            valor: 10.0,
            tipoPagamento: TipoPagamento.CARTAO_DEBITO
        };
        const pagamentoCriado: PagamentoDTO = await pagamentoGateway.createPagamento(novoPagamento);

        const updateStatusPagamentoDTO: UpdateStatusPagamentoDTO = {
            idPagamento: pagamentoCriado.idPagamento as string,
            statusPagamento: StatusPagamento.REJEITADO
        }

        const pagamentoAtualizado: any = await pagamentoGateway.updateStatusPagamento(updateStatusPagamentoDTO);

        expect(pagamentoAtualizado).toBeDefined();
    });
});