import { Schema, model, models } from 'mongoose';

export type TransactionType = 'booking' | 'refund' | 'cancellation';
export interface TransactionMetadata {
  isBundle?: boolean;
  bundleType?: string;
}

export interface TransactionsProps {
  _id?: Object;
  transaction_id: string;
  flight_id: string;
  user_id: number;
  type: TransactionType;
  amount: number;
  timestamp: number;

  metadata: TransactionMetadata;
}

const TransactionsSchema = new Schema<TransactionsProps>({
  transaction_id: { type: String, required: true },
  flight_id: { type: String, required: true },
  user_id: { type: Number, required: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  timestamp: { type: Number, required: true },

  metadata: {
    isBundle: { type: Boolean, required: false },
    bundleType: { type: String, required: false },
  },
});

export const Transactions =
  models.Transactions || model('Transactions', TransactionsSchema);
