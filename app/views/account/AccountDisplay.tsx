'use client';
import { Avatar, Checkbox, Modal } from '@mantine/core';
import { EMAIL, PASSWORD } from '@/app/consts/AccountPropsSettings.json';
import { LockIcon } from '../icons/LockIcon';
import { useRef, useState } from 'react';
import FieldEntry from '../fields/FieldEntry';
import { AccountProps } from '@/app/models/Accounts';
import { AccountUpdateProps, LogInFormProps } from '@/app/types/Accounts.types';
import { useDisclosure } from '@mantine/hooks';
import {
  MINIMUM_MESSAGE_LENGTH,
  MAXIMUM_MESSAGE_LENGTH,
} from '@/app/consts/DashboardSettings.json';

import UserEditLayout, { AccountEditUserProps } from './UserEditLayout';
import Validator from '@/app/controllers/Validator/Validator';

export default function AccountDisplay(props: AccountProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const handleInput = () => {
    const element = ref.current;
    if (!element) return;

    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  async function sendSupportQuery() {
    const element = ref.current;
    if (!element) return;

    const text = element.value;
    const body = { contents: text };
    const validator = new Validator(body);

    if (!validator.validateSupportQuery()) {
      alert(
        `Message must be between ${MINIMUM_MESSAGE_LENGTH} and ${MAXIMUM_MESSAGE_LENGTH} characters.`
      );
      return;
    }

    try {
      const response = await fetch('/api/support/make-query', {
        body: JSON.stringify(body),
        method: 'POST',
      });

      if (!response.ok) {
        alert('Could not send support query, please try again later.');
      } else {
        element.value = '';
        alert('Successfully sent support query!');
      }
    } catch {
      alert('Could not send support query, please try again later.');
    }
  }

  return (
    <>
      <div className="flex justify-center items-center w-full h-150">
        <div className="flex flex-col items-center w-[50%] min-w-100 max-w-250">
          <UserEditLayout props={props as AccountEditUserProps} />
          <div className="flex flex-col w-[75%] h-50 gap-2 mt-5">
            <h2 className="text-md font-medium text-black">Support centre</h2>
            <textarea
              ref={ref}
              onInput={handleInput}
              rows={1}
              className="border outline-none border-black/25 p-1 shadow-sm bg-white rounded-sm text-black text-md font-normal w-full overflow-y-auto"
              placeholder="What do you want to say?"
            />
            <button
              onClick={sendSupportQuery}
              className="text-white text-md p-1 w-35 rounded-md border-black/50 shadow-sm bg-button-success hover:bg-green-950 duration-150"
            >
              <span className="font-semimedium">Send to Support</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
