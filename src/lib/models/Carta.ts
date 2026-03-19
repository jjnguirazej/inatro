import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICarta extends Document {
  numeroCarta: string;
  nome: string;
  ano: number;
  lote?: string;
  delegacao?: string;
  obs?: string;
  entregue: boolean;
  entregueEm?: Date;
  uploadedAt: Date;
}

const CartaSchema = new Schema<ICarta>(
  {
    numeroCarta: { type: String, required: true, index: true },
    nome: { type: String, required: true },
    ano: { type: Number },
    lote: { type: String },
    delegacao: { type: String },
    obs: { type: String },
    entregue: { type: Boolean, default: false, index: true },
    entregueEm: { type: Date },
  },
  { timestamps: true }
);

// Compound index for fast lookup
CartaSchema.index({ numeroCarta: 1, delegacao: 1 });

const Carta: Model<ICarta> =
  mongoose.models.Carta || mongoose.model<ICarta>("Carta", CartaSchema);

export default Carta;
