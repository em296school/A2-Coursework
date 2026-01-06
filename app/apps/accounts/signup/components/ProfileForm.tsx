'use client';

/**
 * @component ProfileForm
 * Wrapper component for profile input fields during signup.
 *
 * @author Ethan Mahon (Candidate Number: 9093) | A2 Computer Science Coursework
 * @memberof AccountsApp
 */

import { Group, TextInput, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import AuthenticationWrapper from '@/app/apps/accounts/components/AuthenticationWrapper';
import { NameInputProps } from '@/config/display.config';

/**
 * ProfileForm Component
 *
 * @sourcef /signup/page.tsx
 * @returns Profile form component with first name and last name inputs.
 */
export default function ProfileForm() {
  // Change layout based on screen size
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  if (isSmallScreen) {
    return (
      <Stack style={{ width: '100%' }}>
        <AuthenticationWrapper>
          <TextInput
            label="First Name"
            placeholder="Enter your first name"
            style={{ flex: 1, ...NameInputProps }}
            name="first_name"
          />
        </AuthenticationWrapper>
        <AuthenticationWrapper>
          <TextInput
            label="Last Name"
            placeholder="Enter your last name"
            style={{ flex: 1, ...NameInputProps }}
            name="last_name"
          />
        </AuthenticationWrapper>
      </Stack>
    );
  }

  return (
    <Group gap="lg" justify="center" align="center" style={{ width: '100%' }}>
      <AuthenticationWrapper>
        <TextInput
          label="First Name"
          placeholder="Enter your first name"
          style={{ flex: 1 }}
          name="first_name"
        />
      </AuthenticationWrapper>
      <AuthenticationWrapper>
        <TextInput
          label="Last Name"
          placeholder="Enter your last name"
          style={{ flex: 1 }}
          name="last_name"
        />
      </AuthenticationWrapper>
    </Group>
  );
}
