'use client';

/**
 * @component EmailInput
 * Email input component with validation and error handling.
 * 
 * @author Ethan Mahon (Candidate Number: 9093) | A2 Computer Science Coursework
 * @memberof AccountsApp
 */

import ClearableInput from '@/app/components/ClearableInput';
import { IconAt } from '@tabler/icons-react';
import { useState } from 'react';
import EmailInputProps from '../types/EmailInput';

// Constant variables
const icons__emailIcon = <IconAt size={18} stroke={1.5} />;

// Functions
function emailIsValid(email: string): boolean {
  // We use RegExp to validate the email format
  const regExpression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailIsValidBool = regExpression.test(email);

  // We use the boolean value to return the result
  return emailIsValidBool;
}

/**
 * EmailInput Component
 * 
 * @sourcef /login/page.tsx
 * @param props: EmailInputProps
 * @returns Email input component with validation and error handling.
 */
export default function EmailInput(props: EmailInputProps) {
    // Define React state variables
    const [email, setEmail] = useState('');
    const [touched, setTouched] = useState(false);

    let emailValid = email.length > 0;
    if (email && email.length > 0) {
        // No point checking the email if it hasn't been entered yet,
        // so only validate if there is content
        emailValid = emailIsValid(email);
    }

    console.log(touched);
    return (
        <ClearableInput 
            leftSection={icons__emailIcon}
            value={email}
            placeholder='Email address'
            label={props.children ? props.children : 'Email Address'}
            style={props}

            // Event handlers, this is a combination of checking length
            // checking if they've touched the field and then updating the error
            // state, we can not add the email.length > 0 condition in the error
            // itself as that will update on every keystroke rather than on blur.
            onChange={(event) => {setEmail(event.target.value); (event.target.value.length === 0) && setTouched(false)}}
            onBlur={() => {email.length > 0 && setTouched(true)}}
            setValue={(value) => {setEmail(value); (value.length === 0) && setTouched(false)}}
            error={touched && !emailValid ? 'Please enter a valid email address.' : undefined}
        />
    )
}