import { Ref, useEffect, useRef, useState } from 'react';
import { UserIcon } from '../icons/UserIcon';
import { DashboardPageTitle } from './StaffDashboard';
import { Badge, Loader, Modal, Tooltip } from '@mantine/core';
import { FoundUserProps } from '@/app/types/Accounts.types';
import { formatToName } from '@/app/helpers/formatToName';
import { useDisclosure } from '@mantine/hooks';
import {
  MINIMUM_MESSAGE_LENGTH,
  MAXIMUM_MESSAGE_LENGTH,
} from '@/app/consts/DashboardSettings.json';

import Validator from '@/app/controllers/Validator/Validator';

interface ListStateProps {
  users: FoundUserProps[];
  searchFilter: string;
  loading: boolean;
}

interface SearchProps {
  ref: Ref<HTMLInputElement>;
  onSearch: () => void;
}

export function StaffLayout() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [users, setUsers] = useState<FoundUserProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  function onSearch() {
    const element = searchRef.current;
    if (!element) return;

    setSearchFilter(element.value);
  }

  async function getUsersFromSearchFilter() {
    try {
      const response = await fetch('/api/dashboard/get-users', {
        body: JSON.stringify(searchFilter),
        method: 'POST',
      });

      if (!response.ok) {
        setUsers([]);
        return;
      }

      const gotUsers = await response.json();
      setUsers(gotUsers);
    } catch {
      setUsers([]);
    }
  }

  useEffect(() => {
    setLoading(true);
    getUsersFromSearchFilter().finally(() => setLoading(false));
  }, [searchFilter]);

  return (
    <div className="flex flex-row gap-1 w-full h-20">
      <StaffList searchFilter={searchFilter} users={users} loading={loading} />
      <StaffSearch ref={searchRef} onSearch={onSearch} />
    </div>
  );
}

function StaffButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center rounded-lg border border-black/10 p-1 not-disabled:hover:shadow-sm disabled:cursor-not-allowed"
    >
      <span className="text-[10px] truncate">{children}</span>
    </button>
  );
}

function Staff(account: FoundUserProps & { key: number }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [messageOpened, messageHandler] = useDisclosure(false);
  const [closureOpened, closureHandler] = useDisclosure(false);

  let isGrey = account.key % 2 == 0;
  let firstName = formatToName(account.first_name);

  const handleInput = () => {
    const element = ref.current;
    if (!element) return;

    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  async function sendMessage() {
    const element = ref.current;
    if (!element) return;

    const text = element.value;
    const validator = new Validator(text);

    if (validator.validateSendMessage()) {
      alert(
        `Message must be between ${MINIMUM_MESSAGE_LENGTH} and ${MAXIMUM_MESSAGE_LENGTH} characters.`
      );
    } else {
      try {
        const response = await fetch('/api/dashboard/send-message', {
          method: 'POST',
          body: JSON.stringify({
            title: 'Staff message',
            contents: text,
            recipient_id: account.user_id,
          }),
        });

        if (!response.ok) {
          alert("Couldn\'t send message at this time, please try again later.");
        } else {
          alert('Sent message.');
        }
      } catch {
        alert("Couldn\'t send message at this time, please try again later.");
      }
    }
    messageHandler.close();
  }

  async function closeAccount() {
    try {
      const response = await fetch('/api/dashboard/close-account', {
        body: JSON.stringify({
          user_id: account.user_id,
        }),
        method: 'POST',
      });

      if (!response.ok) {
        alert("Couldn't delete account at this time.");
      } else {
        alert('Successfully closed this account.');
      }
    } catch {
      alert("Couldn't delete account at this time.");
    }
    closureHandler.close();
  }

  return (
    <>
      <Modal
        opened={messageOpened}
        title={`Send ${firstName} a message`}
        onClose={messageHandler.close}
        withCloseButton
        centered
      >
        <div className="flex flex-col w-full h-100 p-1 gap-4">
          <textarea
            ref={ref}
            onInput={handleInput}
            rows={1}
            className="border outline-none border-black/50 shadow-sm bg-white rounded-sm text-black text-md font-normal w-full overflow-y-hidden"
            placeholder="What do you want to say?"
          />
          <Tooltip label={`Send message to ${firstName}`}>
            <button
              onClick={sendMessage}
              className="p-1 bg-gg-green shadow-black/20 w-20 text-white text-lg font-semibold rounded-lg hover:shadow-lg duration-150"
            >
              Send
            </button>
          </Tooltip>
        </div>
      </Modal>

      <Modal
        opened={closureOpened}
        onClose={closureHandler.close}
        title={'Are you sure?'}
        centered
      >
        <div className="flex flex-col gap-8">
          <span className="text-md text-black/50">
            Are you sure you want to close this account?
          </span>
          <div className="flex flex-row justify-center gap-2 w-full">
            <button
              onClick={closeAccount}
              className="rounded-lg text-white text-lg font-medium bg-button-success px-3 py-2 h-10 items-center shadow-black/20 hover:shadow-lg duration-150"
            >
              Close this account
            </button>
            <button
              onClick={closureHandler.close}
              className="rounded-lg text-white text-lg font-medium bg-button-danger px-3 py-2 h-10 items-center shadow-black/20 hover:shadow-lg duration-150"
            >
              Nevermind
            </button>
          </div>
        </div>
      </Modal>

      <div
        className={`flex flex-row gap-2 select-none items-center rounded-sm text-sm font-medium h-7 w-full cursor-pointer text-black/70 ${isGrey ? 'bg-black/5 hover:bg-white' : 'bg-white hover:bg-black/5'}`}
      >
        <div className="w-5">
          <UserIcon size={13} strokeWidth={2} />
        </div>
        <div className="w-75">
          {account.last_name.toUpperCase()}, {formatToName(account.first_name)}
        </div>
        <div className="flex justify-end gap-1 w-full h-full">
          <StaffButton onClick={messageHandler.open}>Send message</StaffButton>
          <StaffButton onClick={closureHandler.open}>Close account</StaffButton>
        </div>
      </div>
    </>
  );
}

export function StaffList(props: ListStateProps) {
  return (
    <div className="flex flex-col w-120 p-1 max-h-200 overflow-y-auto bg-white rounded-md shadow-sm border border-black/20">
      {props.loading ? (
        <div className="flex justify-center items-center w-full h-full">
          <Loader size={30} />
        </div>
      ) : (
        props.users.map((account, index) => {
          if (!account.is_staff) return;
          return <Staff {...account} key={index} />;
        })
      )}
    </div>
  );
}

export function StaffSearch(props: SearchProps) {
  return (
    <div className="flex flex-col w-60 py-1 px-2 h-50 bg-white rounded-md shadow-sm border border-black/20">
      <div className="flex flex-col text-sm gap-2">
        <h2 className="text-xs text-black/20 font-bold">SEARCH</h2>
        <input
          ref={props.ref}
          className="border outline-none border-black/20 py-1 shadow-sm bg-white rounded-sm text-black text-md font-normal w-full overflow-y-hidden"
          placeholder="Search for staff"
        />
        <button
          onClick={props.onSearch}
          className="flex items-center h-7 w-fit px-2 py-1 bg-gg-green text-white rounded-lg cursor-pointer hover:bg-green-950 duration-150 disabled:bg-black/20 disabled:cursor-not-allowed"
        >
          <span className="text-xs font-medium">Search</span>
        </button>
      </div>
    </div>
  );
}

export default function ManagementPage() {
  return (
    <div className="flex flex-col w-full gap-2">
      <DashboardPageTitle
        icon={<UserIcon size={25} strokeWidth={2} />}
        title="Management"
        description="Manage staff members."
      />
      <StaffLayout />
    </div>
  );
}
