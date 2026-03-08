import { EMAIL, PASSWORD } from '@/app/consts/AccountPropsSettings.json';
import { AccountUpdateProps } from '@/app/types/Accounts.types';

const emailRegEx = new RegExp(EMAIL.REGEX);
const passwordRegEx = new RegExp(PASSWORD.REGEX);

function textIsEmpty(text: string) {
  return text.length === 0;
}

export default function ValidateAccountUpdate(
  params: unknown
): params is AccountUpdateProps {
  if (!params || typeof params !== 'object') {
    return false;
  }

  const props = <AccountUpdateProps>params;

  // Deconstruct the props and check:
  const { email, password, isSelfSubmit, requires_assistance, wheelchair } =
    props;

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    typeof isSelfSubmit !== 'boolean' ||
    typeof requires_assistance !== 'boolean' ||
    typeof wheelchair !== 'boolean'
  ) {
    return false;
  }

  // Check the props now we know they exist.
  // (Empty text is considered NO CHANGE)
  const emailLooksFine =
    textIsEmpty(props.email) || emailRegEx.test(props.email);
  const passwordLooksFine =
    textIsEmpty(props.password) || passwordRegEx.test(props.password);

  return emailLooksFine && passwordLooksFine;
}
