import { PASSWORD } from '@/app/consts/AccountPropsSettings.json';

const passwordRegEx = new RegExp(PASSWORD.REGEX);
export default function ValidateAccountPassword(data: string | any) {
  if (!data || typeof data !== 'string') return false;

  const password = <string>data;

  // Check if the password looks fine:
  const passwordLooksFine = passwordRegEx.test(password);

  return passwordLooksFine;
}
