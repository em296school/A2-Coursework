import { Schema, model, models } from 'mongoose';

export interface SupportQueryProps {
  _id?: Object;
  message_id: string;
  message: {
    contents: string;
  };
  author_id: number;
  timestamp: number;
  claimed_id?: number;
}

const SupportQueriesSchema = new Schema<SupportQueryProps>({
  message_id: { type: String, required: true },
  message: {
    contents: { type: String, required: true },
  },
  author_id: { type: Number, required: true },
  timestamp: { type: Number, required: true },
  claimed_id: { type: Number, required: true, default: 0 },
});

export const SupportQueries =
  models.SupportQueries || model('SupportQueries', SupportQueriesSchema);
