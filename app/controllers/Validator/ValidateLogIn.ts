import { LogInFormProps } from '@/app/types/Accounts.types';
import { EMAIL } from '@/app/consts/AccountPropsSettings.json';

const emailRegEx = new RegExp(EMAIL.REGEX);

export default function ValidateLogIn(data: LogInFormProps | any) {
  const { email, password } = data;
  return emailRegEx.test(email) && password.length >= 8;
}
