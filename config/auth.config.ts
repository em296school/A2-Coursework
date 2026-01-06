import { UndefinedAuthenticationRequirement } from '@/app/apps/accounts/components/types/AuthenticationRequirements';

// Actions & Maps
export type AuthenticationAction = 'login' | 'signup' | 'reset_password';
export const SignUpAuthenticationRequirements: UndefinedAuthenticationRequirement =
  {
    first_name: nameIsValid,
    last_name: nameIsValid,
    email: emailIsValid,
    password: passwordIsValid,
  };

export const AuthenticationMap = {
  signup: SignUpAuthenticationRequirements,
  login: {},
  reset_password: {},
};

// Validation Constants & Functions
export const PasswordStrongRequirements = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

export function emailIsValid(email: string): boolean {
  // We use RegExp to validate the email format
  const regExpression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailIsValidBool = regExpression.test(email);

  // We use the boolean value to return the result
  return emailIsValidBool;
}

export function passwordIsValid(password: string): boolean {
  // Check if the password meets all strong requirements
  for (const requirement of PasswordStrongRequirements) {
    if (!requirement.re.test(password)) {
      return false;
    }
  }

  return true;
}

export function nameIsValid(name: string): boolean {
  // This RegEx allows letters (including accented), spaces, hyphens, and apostrophes
  // Prevents consecutive special characters and ensures the name starts and ends with a letter
  // (so we don't have stuff like Name--Name or ' Name')
  const nameRegex =
    /^(?!.*[ '-]{2})[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
  return nameRegex.test(name);
}
