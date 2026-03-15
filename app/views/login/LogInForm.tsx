'use client';

import { useState } from 'react';
import FieldEntry from '../fields/FieldEntry';
import { LockIcon } from '../icons/LockIcon';

import IconButton from '../utilities/buttons/IconButton';
import { AccountActionIcon } from '../icons/AccountActionIcon';
import { LogInFormProps } from '@/app/types/Accounts.types';
import { EMAIL } from '@/app/consts/AccountPropsSettings.json';
import Validator from '@/app/controllers/Validator/Validator';
import { useDisclosure } from '@mantine/hooks';
import { Dialog } from '@mantine/core';
import { AlertIcon } from '../icons/AlertIcon';
import Skeleton from '../Skeleton';
import { useRouter } from 'next/navigation';
import { ADMIN_ACCOUNT_NAME } from '@/app/consts/AdminAccountName.json';

const emailRegEx = new RegExp(EMAIL.REGEX);

function textIsEmpty(text: string) {
  return text.length == 0;
}

export default function LogInForm() {
  const router = useRouter();

  const [opened, { toggle, close }] = useDisclosure(false);
  const [errorMessage, setErrorMessage] = useState<string>(
    'Unexpected error encountered.'
  );
  const [tryingToLogIn, setTryingToLogIn] = useState<boolean>(false);
  const [details, setDetails] = useState<LogInFormProps>({
    email: '',
    password: '',
  });

  async function logIn() {
    // Disallow two requests from the button:
    if (tryingToLogIn) return;

    // Check all the params before sending:
    const validator = new Validator(details);
    const formIsValid = validator.validateLogIn();

    function reset(message?: string) {
      setErrorMessage(message || 'Could not sign in at this time.');
      if (!opened) toggle();

      setTryingToLogIn(false);
    }

    if (formIsValid) {
      setTryingToLogIn(true);

      try {
        let response = await fetch('/api/accounts/login', {
          body: JSON.stringify(details),
          method: 'POST',
        });

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

  function setDetailsForm(field: string) {
    return function (input: string) {
      setDetails((prev) => ({
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
  if (tryingToLogIn) {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col justify-center items-center gap-4 h-44">
            <Skeleton width="100%" height="22px" />
            <Skeleton width="75%" height="22px" />
            <Skeleton width="40%" height="22px" />
          </div>
          <div className="flex flex-row gap-3 items-center">
            <IconButton
              width={'40px'}
              buttonStyle={'primary'}
              icon={<AccountActionIcon />}
              disabled
            >
              Log In
            </IconButton>
            <a
              href="/login"
              rel="noreferrer"
              className="flex w-40 justify-center text-black/60 hover:underline"
            >
              Create an account
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
            title="Email"
            placeholder="johnsmith@example.com"
            submitFn={setDetailsForm('email')}
            isValidPredicate={(text) => {
              return {
                hint: EMAIL.HINT,
                isValid:
                  textIsEmpty(text) ||
                  emailRegEx.test(text) ||
                  text === ADMIN_ACCOUNT_NAME,
              };
            }}
          />
          <FieldEntry
            title="Password"
            leftSvg={<LockIcon className="stroke-black/20 stroke-[1.5px]" />}
            submitFn={setDetailsForm('password')}
            isPassword
          />
        </div>
        <div className="flex flex-row gap-3 items-center">
          <IconButton
            width={'40px'}
            buttonStyle={'primary'}
            icon={<AccountActionIcon />}
            onClick={logIn}
          >
            Log In
          </IconButton>
          <a
            href="/signup"
            rel="noreferrer"
            className="flex w-40 justify-center text-black/60 hover:underline"
          >
            Create an account
          </a>
        </div>
      </div>
      {errorSigningInDialog}
    </>
  );
}
