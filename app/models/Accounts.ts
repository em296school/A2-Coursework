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
  _id?: Object;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  passwordHash: string;
  telephone: string;
  is_staff: boolean;
  is_admin: boolean;

  requires_assistance?: boolean;
  wheelchair?: boolean;
}

export type UncreatedAccountProps = Omit<
  AccountProps,
  'user_id' | 'passwordHash' | 'is_staff'
>;

const AccountSchema = new Schema<AccountProps>({
  user_id: { type: Number, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  telephone: { type: String, required: true },
  is_staff: Boolean,
  is_admin: Boolean,

  requires_assistance: {
    type: Boolean,
    required: false,
  },
  wheelchair: {
    type: Boolean,
    required: false,
  },
});

export const Accounts = models.Accounts || model('Accounts', AccountSchema);
