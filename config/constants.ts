// Domain Constants
export const RootDomain = 'greenglide-airlines.com';

// Login & Signup Constants
export const PasswordStrongRequirements = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

export const PasswordInputStyle = {
    width: '500px',
    maxWidth: '60vw',
}
export const EmailInputStyle = {
    width: '500px',
    maxWidth: '60vw',
}