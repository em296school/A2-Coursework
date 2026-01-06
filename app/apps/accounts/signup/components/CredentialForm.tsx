/**
 * @component CredentialForm
 * Wrapper component for email and password input fields during signup.
 *
 * @author Ethan Mahon (Candidate Number: 9093) | A2 Computer Science Coursework
 * @memberof AccountsApp
 */

import { Stack } from '@mantine/core';
import { PasswordInputProps, EmailInputProps } from '@/config/display.config';

import AuthenticationWrapper from '@/app/apps/accounts/components/AuthenticationWrapper';
import EmailInput from './EmailInput';
import PasswordInputStrength from './PasswordInputStrength';

/**
 * CredentialForm Component
 *
 * @sourcef /signup/page.tsx
 * @returns Credential form component with email and password inputs.
 */
export default function CredentialForm() {
  return (
    <Stack justify="center" align="center">
      <EmailInput {...EmailInputProps}>Email Address</EmailInput>
      <PasswordInputStrength {...PasswordInputProps}>
        Password
      </PasswordInputStrength>
    </Stack>
  );
}
