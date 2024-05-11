import { IPagamentoUseCase } from "../interfaces/IPagamentoUseCase";
import Pagamento from "../models/Pagamento.model";
import { NovoPagamentoDTO } from "../models/dtos/NovoPagamentoDTO";
import { PagamentoDTO } from "../models/dtos/PagamentoDTO";
import { UpdateStatusPagamentoDTO } from "../models/dtos/UpdateStatusPagamentoDTO";
import { TipoPagamento } from "../models/enums/TipoPagamento";
import PagamentoUseCase from "../useCases/PagamentoUseCase";

import { StatusPagamento } from "../models/enums/StatusPagamento";
import mockPagamentoGateway from "./mocks/MockPagamentoGateway";

describe("PagamentoUseCase - Criar novo pagamento", () => {
    let pagamentoUseCase: IPagamentoUseCase;

    beforeAll(async () => {
        pagamentoUseCase = new PagamentoUseCase(mockPagamentoGateway);
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

        const pagamentoCriado: PagamentoDTO = await pagamentoUseCase.executeCreation(novoPagamento);

        expect(pagamentoCriado).toBeDefined();
        expect(pagamentoCriado.idPedido).toEqual(1);
        expect(pagamentoCriado.valor).toEqual(10);
    });

    it("deve lançar erro caso um campo obrigatório não seja informado", async () => {
        const novoPagamentoSemIdPedido: any = {
            valor: 10.0,
            tipoPagamento: TipoPagamento.CARTAO_CREDITO
        };

        expect(async () => {
            await pagamentoUseCase.executeCreation(novoPagamentoSemIdPedido);
        }).rejects.toThrow("Campos obrigatórios não informados.");
    });

    it("deve lançar erro caso o tipoPagamento seja inválido", async () => {
        const novoPagamentoTipoPagamentoInvalido: any = {
            idPedido: 1,
            valor: 10.0,
            tipoPagamento: "tipo_pagamento_invalido"
        };

        expect(async () => {
            await pagamentoUseCase.executeCreation(novoPagamentoTipoPagamentoInvalido);
        }).rejects.toThrow("Tipo de pagamento inválido.");
    });
});

describe("PagamentoUseCase - Erro no Gateway de Pagamento", () => {
    let pagamentoUseCase: PagamentoUseCase;

    beforeAll(async () => {
        pagamentoUseCase = new PagamentoUseCase(mockPagamentoGateway);
        jest.spyOn(mockPagamentoGateway, "createPagamento")
            .mockRejectedValueOnce(new Error());
        jest.spyOn(mockPagamentoGateway, "getPagamentoPorIdPagamento")
            .mockRejectedValueOnce(new Error());
        jest.spyOn(mockPagamentoGateway, "getPagamentoPorIdPedido")
            .mockRejectedValueOnce(new Error());
    });

    afterAll(async () => {
        jest.clearAllMocks();
        await Pagamento.collection.deleteMany();
    });

    it("deve lançar erro caso ocorra erro ao criar um pagamento Gateway", async () => {
        const novoPagamento: NovoPagamentoDTO = {
            idPedido: 1,
            valor: 10.0,
            tipoPagamento: TipoPagamento.CARTAO_CREDITO
        };

        expect(async () => {
            await pagamentoUseCase.executeCreation(novoPagamento);
        }).rejects.toThrow("Falha ao criar pagamento.");
    });

    it("deve lançar erro caso ocorra erro ao buscar pagamento pelo idPagamento no Gateway", async () => {
        expect(async () => {
            await pagamentoUseCase.executeGetPagamentoPorIdPagamento("idPagamento");
        }).rejects.toThrow("Falha ao buscar pagamento por idPagamento.");
    });

    it("deve lançar erro caso ocorra erro ao buscar pagamento pelo idPedido no Gateway", async () => {
        expect(async () => {
            await pagamentoUseCase.executeGetPagamentoPorIdPedido("idPedido");
        }).rejects.toThrow("Falha ao buscar pagamento por idPedido.");
    });
});

describe("PagamentoUseCase - Busca de pagamento por idPagamento", () => {
    let pagamentoUseCase: PagamentoUseCase;

    beforeAll(async () => {
        pagamentoUseCase = new PagamentoUseCase(mockPagamentoGateway);
    });

    afterAll(async () => {
        jest.clearAllMocks();
        await Pagamento.collection.deleteMany();
    });

    beforeEach(async () => {
        await Pagamento.collection.deleteMany();
    });

    it("deve retornar o pagamento caso encontre por idPagamento", async () => {
        const novoPagamento: NovoPagamentoDTO = {
            idPedido: 1,
            valor: 10.0,
            tipoPagamento: TipoPagamento.CARTAO_DEBITO
        };
        const pagamentoCriado: PagamentoDTO = await pagamentoUseCase.executeCreation(novoPagamento);

        const pagamentoBuscado: PagamentoDTO = await pagamentoUseCase.executeGetPagamentoPorIdPagamento(pagamentoCriado.idPagamento as string);

        expect(pagamentoBuscado).toBeDefined();
        expect(pagamentoBuscado.idPagamento).toEqual(pagamentoCriado.idPagamento);
    });

    it("deve lançar erro caso o idPagamento não seja informado", async () => {
        expect(async () => {
            await pagamentoUseCase.executeGetPagamentoPorIdPagamento("");
        }).rejects.toThrow("Campo do 'idPagamento' é obrigatório.");
    });

    it("deve lançar erro caso o pagamento não seja localizado", async () => {
        jest.spyOn(mockPagamentoGateway, "getPagamentoPorIdPagamento")
            .mockImplementationOnce(async () => {
                return null;
            });
        expect(async () => {
            await pagamentoUseCase.executeGetPagamentoPorIdPagamento("6634de79fb9e0aa392182280");
        }).rejects.toThrow("Pagamento não localizado.");
    });
});

describe("PagamentoUseCase - Busca de pagamento por idPedido", () => {
    let pagamentoUseCase: PagamentoUseCase;

    beforeAll(async () => {
        pagamentoUseCase = new PagamentoUseCase(mockPagamentoGateway);
        await Pagamento.collection.deleteMany();
    });

    afterAll(async () => {
        jest.clearAllMocks();
        await Pagamento.collection.deleteMany();
    });

    it("deve retornar o pagamento caso encontre por idPedido", async () => {
        const pagamento1: NovoPagamentoDTO = {
            idPedido: 1,
            valor: 10.0,
            tipoPagamento: TipoPagamento.CARTAO_DEBITO
        };
        const pagamento2: NovoPagamentoDTO = {
            idPedido: 1,
            valor: 10.0,
            tipoPagamento: TipoPagamento.CARTAO_DEBITO
        };

        await pagamentoUseCase.executeCreation(pagamento1);
        await pagamentoUseCase.executeCreation(pagamento2);

        const pagamentos: PagamentoDTO[] = await pagamentoUseCase.executeGetPagamentoPorIdPedido("1");

        expect(pagamentos).toBeDefined();
    });

    it("deve lançar erro caso o idPedido não seja informado", async () => {
        expect(async () => {
            await pagamentoUseCase.executeGetPagamentoPorIdPedido("");
        }).rejects.toThrow("Campo do 'idPedido' é obrigatório.");
    });

    it("deve lançar erro caso o pagamento não seja localizado", async () => {
        jest.spyOn(mockPagamentoGateway, "getPagamentoPorIdPagamento")
            .mockImplementationOnce(async () => {
                return null;
            });
        expect(async () => {
            await pagamentoUseCase.executeGetPagamentoPorIdPedido("3");
        }).rejects.toThrow("Pagamento(s) não localizado(s) para o pedido 3.");
    });
});

describe("PagamentoUseCase - Atualizar statusPagamento pelo idPagamento", () => {
    let pagamentoUseCase: PagamentoUseCase;

    beforeAll(async () => {
        pagamentoUseCase = new PagamentoUseCase(mockPagamentoGateway);
        await Pagamento.collection.deleteMany();
    });

    afterAll(async () => {
        jest.clearAllMocks();
        await Pagamento.collection.deleteMany();
    });

    it("deve atualizar o statusPagamento pelo idPagamento", async () => {
        const novoPagamento: NovoPagamentoDTO = {
            idPedido: 1,
            valor: 10.0,
            tipoPagamento: TipoPagamento.CARTAO_DEBITO
        };
        const pagamentoCriado: PagamentoDTO = await pagamentoUseCase.executeCreation(novoPagamento);

        const updateStatusPagamentoDTO: UpdateStatusPagamentoDTO = {
            idPagamento: pagamentoCriado.idPagamento as string,
            statusPagamento: StatusPagamento.REJEITADO
        }

        const pagamentoAtualizado: any = await pagamentoUseCase.executeUpdateStatusPagamento(updateStatusPagamentoDTO);

        expect(pagamentoAtualizado).toBeDefined();
    });

    it("deve lançar erro caso o idPagamento não seja informado", async () => {
        expect(async () => {
            await pagamentoUseCase.executeUpdateStatusPagamento({ idPagamento: "", statusPagamento: StatusPagamento.APROVADO });
        }).rejects.toThrow("Campos obrigatórios não informados.");
    });

    it("deve lançar erro caso o statusPagamento esteja incorreto", async () => {
        const updateStatusPagamentoDTO: any = {
            idPagamento: "idPagamento",
            statusPagamento: "status_pagamento_invalido"
        }
        expect(async () => {
            await pagamentoUseCase.executeUpdateStatusPagamento(updateStatusPagamentoDTO);
        }).rejects.toThrow("Status de pagamento inválido.");
    });
});