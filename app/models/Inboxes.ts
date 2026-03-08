import { Schema, model, models } from 'mongoose';

export interface InboxProps {
  _id?: Object;
  message_id: string;
  message: {
    title: string;
    contents: string;
  };
  author: string;
  timestamp: number;
  unread: boolean;
  recipient_id: number;
}

const InboxesSchema = new Schema<InboxProps>({
  message_id: { type: String, required: true },
  message: {
    title: { type: String, required: true },
    contents: { type: String, required: true },
  },
  author: { type: String, required: true },
  timestamp: { type: Number, required: true },
  unread: { type: Boolean, required: true },
  recipient_id: { type: Number, required: true },
});

export const Inboxes = models.Inboxes || model('Inboxes', InboxesSchema);
