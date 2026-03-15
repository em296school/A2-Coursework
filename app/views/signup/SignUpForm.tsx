'use client';

import { useState } from 'react';
import FieldEntry from '../fields/FieldEntry';
import { LockIcon } from '../icons/LockIcon';

import IconButton from '../utilities/buttons/IconButton';
import { AccountActionIcon } from '../icons/AccountActionIcon';
import { RegistrationFormProps } from '@/app/types/Accounts.types';
import {
  FIRST_NAME,
  LAST_NAME,
  EMAIL,
  TELEPHONE,
  PASSWORD,
} from '@/app/consts/AccountPropsSettings.json';
const firstNameRegEx = new RegExp(FIRST_NAME.REGEX);
const lastNameRegEx = new RegExp(LAST_NAME.REGEX);
const emailRegEx = new RegExp(EMAIL.REGEX);
const telephoneRegEx = new RegExp(TELEPHONE.REGEX);
const passwordRegEx = new RegExp(PASSWORD.REGEX);

import Validator from '@/app/controllers/Validator/Validator';
import Skeleton from '../Skeleton';
import { useDisclosure } from '@mantine/hooks';
import { Dialog } from '@mantine/core';
import { AlertIcon } from '../icons/AlertIcon';
import { useRouter } from 'next/navigation';

function textIsEmpty(text: string) {
  return text.length == 0;
}

export default function SignUpForm() {
  const router = useRouter();

  const [opened, { toggle, close }] = useDisclosure(false);
  const [errorMessage, setErrorMessage] = useState<string>(
    'Unexpected error encountered.'
  );
  const [tryingToSignUp, setTryingToSignUp] = useState<boolean>(false);
  const [registration, setRegistration] = useState<RegistrationFormProps>({
    first_name: '',
    last_name: '',
    email: '',
    telephone: '',
    password: '',
  });

  async function signUp() {
    // Disallow two requests from the button:
    if (tryingToSignUp) return;

    // Check all the params before sending:
    const validator = new Validator(registration);
    const formIsValid = validator.validateSignUp();

    function reset(message?: string) {
      setErrorMessage(message || 'Could not sign in at this time.');
      if (!opened) toggle();

      setTryingToSignUp(false);
    }

    if (formIsValid) {
      setTryingToSignUp(true);

      try {
        let response: Response & { message?: string } = await fetch(
          '/api/accounts/signup',
          {
            body: JSON.stringify(registration),
            method: 'POST',
          }
        );

        const result = await response.json();
        if (!response.ok) {
          let message = result.message;
          reset(message);
          return;
        }

        router.push('/');
      } catch (err: Error | any) {
        let message = err?.message;
        reset(message);
      }
    } else {
      reset('You have a missing, or invalid field.');
    }
  }

  function setRegistrationForm(field: string) {
    return function (input: string) {
      setRegistration((prev) => ({
        ...prev,
        [field]: input,
      }));
    };
  }

  const errorSigningInDialog = (
    <Dialog
      opened={opened}
      withCloseButton
      onClose={close}
      size="lg"
      radius="md"
    >
      <div className="flex flex-row gap-3">
        <AlertIcon strokeWidth={'2px'} />
        <div className="text-xl text-black">{errorMessage}</div>
      </div>
    </Dialog>
  );

  // Return a skeleton to show that its loading
  if (tryingToSignUp) {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col justify-center items-center gap-4 h-110">
            <Skeleton width="60px" height="60px" rounded />
            <br />
            <Skeleton width="50%" height="22px" />
            <Skeleton width="100%" height="22px" />
            <Skeleton width="50%" height="22px" />
          </div>
          <div className="flex flex-row gap-3 items-center">
            <IconButton
              width={'40px'}
              buttonStyle={'primary'}
              icon={<AccountActionIcon />}
              disabled
            >
              Sign up
            </IconButton>
            <a
              href="/login"
              rel="noreferrer"
              className="flex w-40 justify-center text-black/60 hover:underline"
            >
              I have an account
            </a>
          </div>
        </div>
        {errorSigningInDialog}
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <FieldEntry
            title="First name"
            placeholder="John"
            submitFn={setRegistrationForm('first_name')}
            isValidPredicate={(text) => {
              return {
                hint: FIRST_NAME.HINT,
                isValid: textIsEmpty(text) || firstNameRegEx.test(text),
              };
            }}
          />
          <FieldEntry
            title="Last name"
            placeholder="Smith"
            submitFn={setRegistrationForm('last_name')}
            isValidPredicate={(text) => {
              return {
                hint: LAST_NAME.HINT,
                isValid: textIsEmpty(text) || lastNameRegEx.test(text),
              };
            }}
          />
          <FieldEntry
            title="Email"
            placeholder="johnsmith@example.com"
            submitFn={setRegistrationForm('email')}
            isValidPredicate={(text) => {
              return {
                hint: EMAIL.HINT,
                isValid: textIsEmpty(text) || emailRegEx.test(text),
              };
            }}
          />
          <FieldEntry
            title="Telephone"
            placeholder="07700 900123"
            submitFn={setRegistrationForm('telephone')}
            isValidPredicate={(text) => {
              return {
                hint: TELEPHONE.HINT,
                isValid: textIsEmpty(text) || telephoneRegEx.test(text),
              };
            }}
          />
          <FieldEntry
            title="Password"
            leftSvg={<LockIcon className="stroke-black/20 stroke-[1.5px]" />}
            submitFn={setRegistrationForm('password')}
            isValidPredicate={(text) => {
              return {
                hint: PASSWORD.HINT,
                isValid: textIsEmpty(text) || passwordRegEx.test(text),
              };
            }}
            isPassword
          />
        </div>
        <div className="flex flex-row gap-3 items-center">
          <IconButton
            width={'40px'}
            buttonStyle={'primary'}
            icon={<AccountActionIcon />}
            onClick={signUp}
          >
            Sign up
          </IconButton>
          <a
            href="/login"
            rel="noreferrer"
            className="flex w-40 justify-center text-black/60 hover:underline"
          >
            I have an account
          </a>
        </div>
      </div>
      {errorSigningInDialog}
    </>
  );
}
