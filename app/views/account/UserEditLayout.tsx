'use client';
import { Avatar, Checkbox, Modal } from '@mantine/core';
import { EMAIL, PASSWORD } from '@/app/consts/AccountPropsSettings.json';
import { LockIcon } from '../icons/LockIcon';
import { useState } from 'react';
import FieldEntry from '../fields/FieldEntry';
import { AccountUpdateProps, LogInFormProps } from '@/app/types/Accounts.types';
import { useDisclosure } from '@mantine/hooks';
import { AccountProps } from '@/app/models/Accounts';

function textIsEmpty(text: string) {
  return text.length == 0;
}

interface AccountUpdateChanges {
  email: string;
  password: string;
  requires_assistance: boolean;
  wheelchair: boolean;
}

export interface AccountEditUserProps {
  requires_assistance: boolean;
  wheelchair: boolean;
  is_staff: boolean;
  user_id: number;
}

const emailRegEx = new RegExp(EMAIL.REGEX);
const passwordRegEx = new RegExp(PASSWORD.REGEX);

export default function UserEditLayout({
  props,
  inModal,
  staffEditor,
  isAdmin,
}: {
  props: AccountEditUserProps;
  inModal?: boolean;
  staffEditor?: boolean;
  isAdmin?: boolean;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [changesMade, setChangesMade] = useState<boolean>(false);
  const [details, setDetails] = useState<AccountUpdateChanges>({
    email: '',
    password: '',
    requires_assistance: props.requires_assistance ? true : false,
    wheelchair: props.wheelchair ? true : false,
  });

  let isDisabled = props.is_staff && !isAdmin;

  function setDetailsForm(field: string) {
    return function (input: string | boolean) {
      if (!changesMade) {
        setChangesMade(true);
      }

      setDetails((prev) => ({
        ...prev,
        [field]: input,
      }));
    };
  }

  async function updateAccount() {
    close();

    if (isDisabled) return;

    if (!textIsEmpty(details.email) && !emailRegEx.test(details.email)) {
      alert(`Your email is invalid! ${EMAIL.HINT}`);
      return;
    }

    if (
      !textIsEmpty(details.password) &&
      !passwordRegEx.test(details.password)
    ) {
      alert(`Your password is invalid! ${PASSWORD.HINT}`);
      return;
    }

    const updateInfo: AccountUpdateProps = {
      ...details,
      targetId: props.user_id,
      isSelfSubmit: !staffEditor,
    };

    try {
      const response = await fetch('/api/accounts/update-info', {
        body: JSON.stringify(updateInfo),
        method: 'POST',
      });

      if (!response.ok) {
        alert('Failed to update account, please try again later');
      } else {
        alert('Successfully updated account information.');
      }
    } catch {
      alert('Failed to update account, please try again later');
    }
  }
  return (
    <>
      <Modal opened={opened} onClose={close} title="Are you sure?" centered>
        <div className="flex flex-col gap-8">
          <span className="text-md text-black/50">
            {staffEditor
              ? 'Are you sure you want to update this account?'
              : 'Are you sure you want to update your account?'}
          </span>
          <div className="flex flex-row justify-center gap-2 w-full">
            <button
              onClick={updateAccount}
              className="rounded-lg text-white text-lg font-medium bg-button-success px-3 py-2 h-10 items-center shadow-black/20 hover:shadow-lg duration-150"
            >
              Update
            </button>
            <button
              onClick={close}
              className="rounded-lg text-white text-lg font-medium bg-button-danger px-3 py-2 h-10 items-center shadow-black/20 hover:shadow-lg duration-150"
            >
              Nevermind
            </button>
          </div>
        </div>
      </Modal>
      <div
        className={`flex flex-row w-full ${inModal ? 'h-full' : 'h-75'} gap-12`}
      >
        {!inModal ? (
          <div className="flex justify-end items-center w-[30%]">
            <Avatar h={75} w={75} />
          </div>
        ) : (
          <></>
        )}
        <div
          className={`flex flex-col justify-center items-center w-[50%] ${inModal ? '' : 'mt-25'}`}
        >
          <div className="flex flex-col gap-2 w-full h-20">
            <FieldEntry
              title="Email"
              placeholder="johnsmith@example.com"
              submitFn={setDetailsForm('email')}
              isValidPredicate={(text) => {
                return {
                  hint: EMAIL.HINT,
                  isValid: textIsEmpty(text) || emailRegEx.test(text),
                };
              }}
              disabled={isDisabled}
            />
          </div>
          <div className="flex flex-col w-full h-20">
            <FieldEntry
              title="Password"
              leftSvg={<LockIcon className="stroke-black/20 stroke-[1.5px]" />}
              submitFn={setDetailsForm('password')}
              isPassword
              disabled={isDisabled}
            />
          </div>
          <div className="flex flex-row gap-2 w-full h-10 mb-5 text-xs text-black/50">
            <Checkbox
              label="I require assistance"
              disabled={false}
              defaultChecked={props.requires_assistance}
              onChange={(element) => {
                setDetailsForm('requires_assistance')(
                  element.currentTarget.checked
                );
              }}
            />
            <Checkbox
              label="I require a wheelchair"
              disabled={false}
              defaultChecked={props.wheelchair}
              onChange={(element) => {
                setDetailsForm('wheelchair')(element.currentTarget.checked);
              }}
            />
          </div>
          <div className="w-full">
            {isDisabled ? (
              <div className="flex justify-center font-semimedium text-white text-md p-1 w-65 rounded-md border-black/50 shadow-sm bg-button-secondary/50 cursor-not-allowed">
                Cannot update staff accounts
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <button
                  onClick={open}
                  className="text-white text-md p-1 w-35 rounded-md border-black/50 shadow-sm bg-button-success hover:bg-green-950 duration-150"
                >
                  <span className="font-semimedium">Update account</span>
                </button>
                {changesMade ? (
                  <h2 className="font-semimedium text-black/50 text-sm">
                    You have unsaved changes.
                  </h2>
                ) : (
                  <></>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
