import { IPagamentoGateway } from "../interfaces/IPagamentoGateway";
import { IPagamentoUseCase } from "../interfaces/IPagamentoUseCase";
import { NovoPagamentoDTO } from "../models/dtos/NovoPagamentoDTO";
import { PagamentoDTO } from "../models/dtos/PagamentoDTO";
import { TipoPagamento } from "../models/enums/TipoPagamento";

export default class PagamentoUseCase implements IPagamentoUseCase {

    constructor(private pagamentoGateway: IPagamentoGateway) {}

    async executeCreation(novoPagamento: NovoPagamentoDTO): Promise<PagamentoDTO> {
        try {
            this.validateCamposObrigatorios(novoPagamento);

            if (!this.isValidTipoPagamento(novoPagamento.tipoPagamento)) {
                throw new Error("Tipo de pagamento inválido.");
            }

            const pagamentoCriado = await this.pagamentoGateway.createPagamento(novoPagamento);
            const pagamentoDTO: PagamentoDTO = this.mapPagamentoToDTO(pagamentoCriado);

            return pagamentoDTO;
        } catch (error: any) {
            console.error("Erro ao persistir pagamento:", error);
            throw new Error(error.message || "Falha ao criar pagamento.");
        }
    }

    async executeGetPagamentoPorIdPagamento(idPagamento: string): Promise<PagamentoDTO> {
        try {
            if (!idPagamento) {
                throw new Error("Campo do 'idPagamento' é obrigatório.");
            }

            const pagamento = await this.pagamentoGateway.getPagamentoPorIdPagamento(idPagamento);

            if(!pagamento) {
                throw new Error("Pagamento não localizado.");
            }

            const pagamentoDTO: PagamentoDTO = this.mapPagamentoToDTO(pagamento);

            return pagamentoDTO;
        } catch (error: any) {
            console.error("Erro ao buscar pagamento por idPagamento:", error);
            throw new Error(error.message || "Falha ao buscar pagamento por idPagamento.");
        }
    }

    async executeGetPagamentoPorIdPedido(idPedido: string): Promise<PagamentoDTO[]> {
        try {
            if (!idPedido) {
                throw new Error("Campo do 'idPedido' é obrigatório.");
            }

            const pagamentos = await this.pagamentoGateway.getPagamentoPorIdPedido(idPedido);

            if (!pagamentos || pagamentos.length === 0) {
                throw new Error(`Pagamento(s) não localizado(s) para o pedido ${idPedido}.`);
            }

            const pagamentosDTO: PagamentoDTO[] = [];
            for (const pagamento of pagamentos) {
                const pagamentoDTO: PagamentoDTO = this.mapPagamentoToDTO(pagamento);
                pagamentosDTO.push(pagamentoDTO);
            }

            return pagamentosDTO;
        } catch (error: any) {
            console.error("Erro ao buscar pagamento por idPedido:", error);
            throw new Error(error.message || "Falha ao buscar pagamento por idPedido.");
        }
    }

    private isValidTipoPagamento(tipoPagamento: TipoPagamento): boolean {
        return Object.values(TipoPagamento).includes(tipoPagamento);
    }

    private validateCamposObrigatorios(novoPagamento: NovoPagamentoDTO): void {
        if (!novoPagamento.idPedido || !novoPagamento.valor || !novoPagamento.tipoPagamento) {
            throw new Error("Campos obrigatórios não informados.");
        }
    }

    private mapPagamentoToDTO(pagamento: any): PagamentoDTO {    
        return {
            idPagamento: pagamento?._id,
            idPedido: pagamento?.idPedido,
            statusPagamento: pagamento?.statusPagamento,
            tipoPagamento: pagamento?.tipoPagamento,
            dataPagamento: pagamento?.dataPagamento,
            valor: pagamento?.valor
        };
    }
}
