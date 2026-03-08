/**
 * @type Schema
 * Handles user session records within the Database.
 *
 * @pk _id
 * @author Ethan Mahon (Candidate Number: 9093) | A2 Computer Science Coursework
 * @memberof Accounts
 */

import { Schema, model, models } from 'mongoose';

export interface SessionProps {
  userId: number;
  hashed: string;
  expiresAt: Date;
}

const SessionsSchema = new Schema<SessionProps>({
  userId: { type: Number, required: true },
  hashed: { type: String, required: true },

  expiresAt: { type: Date, required: true },
});

// TTL index as this wILl expire
// Tells MongoDB to delete any records which are expired (expiresAt < now)
SessionsSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Sessions = models.Sessions || model('Sessions', SessionsSchema);
