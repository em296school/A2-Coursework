import { RegistrationFormProps } from '@/app/types/Accounts.types';
import ValidateAccountPassword from './ValidateAccountPassword';
import ValidateAccountParams from './ValidateAccountParams';

export default function ValidateSignUp(data: RegistrationFormProps | any) {
  const password = data.password;

  let params: Partial<RegistrationFormProps> = Object.assign({}, data);
  delete params.password;

  return ValidateAccountPassword(password) && ValidateAccountParams(params);
}
