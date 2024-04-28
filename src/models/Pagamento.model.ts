import mongoose, { Document } from "mongoose";
import { StatusPagamento } from "./enums/StatusPagamento";
import { TipoPagamento } from "./enums/TipoPagamento";

export interface PagamentoModel extends Document {
    id?: string;
    idPedido?: number;
    statusPagamento?: StatusPagamento;
    tipoPagamento?: TipoPagamento;
    dataPagamento?: Date;
    valor?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const PagamentoSchema = new mongoose.Schema({
    idPedido: { type: Number, required: true },
    statusPagamento: { type: String, enum: Object.values(StatusPagamento), default: StatusPagamento.PENDENTE, required: true },
    tipoPagamento: { type: String, enum: Object.values(TipoPagamento), required: true },
    dataPagamento: { type: Date, default: Date.now},
    valor: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
  
export default mongoose.model<PagamentoModel>('Pagamento', PagamentoSchema);