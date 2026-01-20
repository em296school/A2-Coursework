import { model, Schema } from 'mongoose';

export interface EmailChallengeProps {
  objective: string;
  authenticationCode: string;
  createdAt: Date;
}
const EmailChallengeSchema = new Schema<EmailChallengeProps>({
  objective: { type: String, required: true },
  authenticationCode: { type: String, required: true },
  createdAt: { type: Date, expires: 3600 },
});

export const EmailChallengeModel = model<EmailChallengeProps>(
  'EmailChallenge',
  EmailChallengeSchema
);
