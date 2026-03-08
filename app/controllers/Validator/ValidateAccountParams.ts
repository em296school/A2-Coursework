import { UncreatedAccountProps } from '@/app/models/Accounts';
import {
  FIRST_NAME,
  LAST_NAME,
  EMAIL,
  TELEPHONE,
} from '@/app/consts/AccountPropsSettings.json';

const firstNameRegEx = new RegExp(FIRST_NAME.REGEX);
const lastNameRegEx = new RegExp(LAST_NAME.REGEX);
const emailRegEx = new RegExp(EMAIL.REGEX);
const telephoneRegEx = new RegExp(TELEPHONE.REGEX);

export default function ValidateAccountParams(
  params: unknown
): params is UncreatedAccountProps {
  if (!params || typeof params !== 'object') {
    return false;
  }

  const props = <UncreatedAccountProps>params;

  // Deconstruct the props and check:
  const { email, first_name, last_name, telephone } = props;
  if (!email || !first_name || !last_name || !telephone) return false;
  if (
    typeof email !== 'string' ||
    typeof first_name !== 'string' ||
    typeof last_name !== 'string' ||
    typeof telephone !== 'string'
  ) {
    return false;
  }

  // Check the props now we know they exist.
  const firstNameLooksFine = firstNameRegEx.test(props.first_name);
  const lastNameLooksFine = lastNameRegEx.test(props.last_name);
  const emailLooksFine = emailRegEx.test(props.email);
  const telephoneLooksFine = telephoneRegEx.test(props.telephone);

  return (
    firstNameLooksFine &&
    lastNameLooksFine &&
    emailLooksFine &&
    telephoneLooksFine
  );
}
