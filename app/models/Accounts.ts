/**
 * @type Schema
 * Handles user account records within the Database.
 *
 * @pk user_id
 * @author Ethan Mahon (Candidate Number: 9093) | A2 Computer Science Coursework
 * @memberof Accounts
 */

import { Schema, model, models } from 'mongoose';

export interface AccountProps {
  _id: boolean;
  user_id: String;
  first_name: String;
  last_name: String;
  email: String;
  password: String;
  telephone: String;
}

const AccountSchema = new Schema<AccountProps>({
  _id: false,
  user_id: { type: String, required: true },
  first_name: { type: String, required: true },
});

export const Accounts = models.Accounts || model('Accounts', AccountSchema);
