import { StatusPagamento } from "../models/enums/StatusPagamento";
import { IPagamentoGateway } from "../interfaces/IPagamentoGateway";
import { IPagamentoUseCase } from "../interfaces/IPagamentoUseCase";
import { NovoPagamentoDTO } from "../models/dtos/NovoPagamentoDTO";
import { PagamentoDTO } from "../models/dtos/PagamentoDTO";
import { UpdateStatusPagamentoDTO } from "../models/dtos/UpdateStatusPagamentoDTO";
import { TipoPagamento } from "../models/enums/TipoPagamento";
import { IQueueAdapter } from "@/interfaces/IQueueAdapter";

export default class PagamentoUseCase implements IPagamentoUseCase {

    private readonly pedidoCriadoQueue: string = process.env.PEDIDO_CRIADO_QUEUE as string;
    private readonly pagamentoCriadoQueue: string = process.env.PAGAMENTO_CRIADO_QUEUE as string;
    private readonly erroPagamentoCriadoQueue: string = process.env.ERRO_PAGAMENTO_CRIADO_QUEUE as string;

    constructor(private pagamentoGateway: IPagamentoGateway, private queueService: IQueueAdapter) {
        this.startConsumingMessages();
    }

    async executeCreation(novoPagamento: NovoPagamentoDTO): Promise<PagamentoDTO> {
        try {
            this.validateCamposObrigatorios(novoPagamento);

            if (!this.isValidEnumValue(TipoPagamento, novoPagamento.tipoPagamento)) {
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

            if (!pagamento) {
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

    async executeUpdateStatusPagamento(updateStatusPedidoDTO: UpdateStatusPagamentoDTO): Promise<PagamentoDTO> {
        try {
            if (!updateStatusPedidoDTO.idPagamento || !updateStatusPedidoDTO.statusPagamento) {
                throw new Error("Campos obrigatórios não informados.");
            }

            if (!this.isValidEnumValue(StatusPagamento, updateStatusPedidoDTO.statusPagamento)) {
                throw new Error("Status de pagamento inválido.");
            }

            const pagamentoAtualizado = await this.pagamentoGateway.updateStatusPagamento(updateStatusPedidoDTO);
            const pagamentoDTO: PagamentoDTO = this.mapPagamentoToDTO(pagamentoAtualizado);

            return pagamentoDTO;
        } catch (error: any) {
            console.error("Erro ao atualizar o status do pagamento.", error);
            throw new Error(error.message || "Falha ao buscar pagamento por idPedido.");
        }
    }

    async startConsumingMessages() {
        await this.queueService.connect();

        await this.queueService.consume(this.pedidoCriadoQueue, async (message: any) => {
            const novoPagamento: NovoPagamentoDTO = {
                idPedido: message.id,
                valor: message.valor,
                tipoPagamento: message.tipoPagamento as TipoPagamento
            };
            await this.executeCreation(novoPagamento).then((pagamentoCriado: PagamentoDTO) => {
                const pagamentoCriadoMessage = {
                    idPagamento: pagamentoCriado.idPagamento,
                    idPedido: pagamentoCriado.idPedido
                };
                this.queueService.publish(this.pagamentoCriadoQueue, pagamentoCriadoMessage);
            }).catch(err => {
                console.log(err);
                this.queueService.publish(this.erroPagamentoCriadoQueue, { idPedido: message.id });
            });
        });
    }

    private isValidEnumValue<T>(enumType: any, value: any): boolean {
        return Object.values(enumType).includes(value);
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
