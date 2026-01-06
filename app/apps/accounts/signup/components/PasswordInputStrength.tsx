'use client';

/**
 * @component PasswordInputStrength
 * Password input component with strength indicator and requirements checklist.
 *
 * @author Ethan Mahon (Candidate Number: 9093) | A2 Computer Science Coursework
 * @memberof AccountsApp
 */

import { useState } from 'react';
import { IconX, IconCheck, IconLock } from '@tabler/icons-react';
import { PasswordInput, Progress, Text, Popover, Box } from '@mantine/core';
import { PasswordStrongRequirements } from '@/config/auth.config';
import PasswordInputProps from '../types/PasswordInput';
import AuthenticationWrapper from '../../components/AuthenticationWrapper';

// Component to display individual password requirement with status icon
function PasswordRequirement({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) {
  return (
    <Text
      c={meets ? 'teal' : 'red'}
      style={{ display: 'flex', alignItems: 'center' }}
      mt={7}
      size="sm"
    >
      {meets ? <IconCheck size={14} /> : <IconX size={14} />}
      <Box ml={10}>{label}</Box>
    </Text>
  );
}

// Function to calculate password strength based on requirements met
function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  PasswordStrongRequirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(
    100 - (100 / (PasswordStrongRequirements.length + 1)) * multiplier,
    10
  );
}

/**
 * PasswordInputStrength Component
 *
 * @sourcef /signup/page.tsx
 * @param props: PasswordInputProps
 * @returns Password input component with strength indicator and requirements checklist.
 */
export default function PasswordInputStrength(props: PasswordInputProps) {
  // Define React state variables
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [value, setValue] = useState('');

  // List out the requirements which will be displayed in the popover
  const checks = PasswordStrongRequirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(value)}
    />
  ));

  // On render we recalcuate our strength and color
  const strength = getStrength(value);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

  // Rerender the lock icon for the left section based on strength
  const icons__lockIcon = (
    <IconLock
      size={18}
      stroke={1.5}
      color={strength === 100 ? 'var(--input-success-color)' : undefined}
    />
  );

  // Render the PasswordInput component
  return (
    <Popover
      opened={popoverOpened}
      position="bottom"
      width="target"
      transitionProps={{ transition: 'fade-up' }}
    >
      <Popover.Target>
        <div
          onFocusCapture={() => setPopoverOpened(true)}
          onBlurCapture={() => setPopoverOpened(false)}
        >
          <AuthenticationWrapper usesCustomSetState={true}>
            <PasswordInput
              label={props.children ? props.children : 'Password'}
              placeholder="Your password"
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
              style={props}
              leftSection={icons__lockIcon}
              name="password"
              styles={{
                input:
                  strength === 100
                    ? {
                        borderColor: 'var(--input-success-color)',
                        backgroundColor:
                          'var(--input-success-background-color)',
                        color: 'var(--input-success-color)',
                        transition: 'all 150ms ease-in-out',
                      }
                    : {
                        transition: 'all 150ms ease-in-out',
                      },
              }}
            />
          </AuthenticationWrapper>
        </div>
      </Popover.Target>
      <Popover.Dropdown>
        <Progress color={color} value={strength} size={5} mb="xs" />
        <PasswordRequirement
          label="Includes at least 6 characters"
          meets={value.length > 5}
        />
        {checks}
      </Popover.Dropdown>
    </Popover>
  );
}
