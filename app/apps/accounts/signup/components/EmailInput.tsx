'use client';

/**
 * @component EmailInput
 * Email input component with validation and error handling.
 *
 * @author Ethan Mahon (Candidate Number: 9093) | A2 Computer Science Coursework
 * @memberof AccountsApp
 */

import ClearableInput from '@/app/components/ClearableInput';
import EmailInputProps from '../types/EmailInput';
import AuthenticationWrapper from '../../components/AuthenticationWrapper';

import { IconAt } from '@tabler/icons-react';
import { useState } from 'react';
import { emailIsValid } from '@/config/auth.config';
import { useAccountRegistration } from '../../components/context/AccountRegistrationContext';

/**
 * EmailInput Component
 *
 * @sourcef /signup/page.tsx
 * @param props: EmailInputProps
 * @returns Email input component with validation and error handling.
 */
export default function EmailInput(props: EmailInputProps) {
  // TODO:  Try make this hard coded (or just remove the close button functionality)
  const { setRegistrationData } = useAccountRegistration();
  const handleRegistrationDataSubmission = (value: string) => {
    setRegistrationData((prevData) => ({
      ...prevData,
      email: value,
    }));
  };

  // Define React state variables
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);

  let emailValid = email.length > 0;
  if (email && email.length > 0) {
    // No point checking the email if it hasn't been entered yet,
    // so only validate if there is content
    emailValid = emailIsValid(email);
  }

  // Render a new icon for the left section based on validity
  const icons__emailIcon = (
    <IconAt
      size={18}
      stroke={1.5}
      color={emailValid ? 'var(--input-success-color)' : undefined}
    />
  );

  // Return the elements
  return (
    <AuthenticationWrapper usesCustomSetState={true}>
      <ClearableInput
        leftSection={icons__emailIcon}
        value={email}
        placeholder="Email address"
        label={props.children ? props.children : 'Email Address'}
        style={props}
        name="email"
        styles={{
          input: emailValid
            ? {
                borderColor: 'var(--input-success-color)',
                backgroundColor: 'var(--input-success-background-color)',
                color: 'var(--input-success-color)',
                transition: 'all 150ms ease-in-out',
              }
            : {
                transition: 'all 150ms ease-in-out',
              },
        }}
        // Event handlers, this is a combination of checking length
        // checking if they've touched the field and then updating the error
        // state, we can not add the email.length > 0 condition in the error
        // itself as that will update on every keystroke rather than on blur.
        onChange={(event) => {
          setEmail(event.target.value);
          event.target.value.length === 0 && setTouched(false);
        }}
        onBlur={() => {
          email.length > 0 && setTouched(true);
        }}
        setValue={(value: string) => {
          setEmail(value);
          handleRegistrationDataSubmission(value);
          value.length === 0 && setTouched(false);
        }}
        error={
          touched && !emailValid
            ? 'Please enter a valid email address.'
            : undefined
        }
      />
    </AuthenticationWrapper>
  );
}
