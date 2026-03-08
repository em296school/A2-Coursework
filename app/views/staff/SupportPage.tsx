import React, { useEffect, useState } from 'react';
import { DashboardPageTitle } from './StaffDashboard';
import { InboxIcon } from '../icons/InboxIcon';
import { SupportQueryProps } from '@/app/models/SupportQueries';
import {
  Avatar,
  Badge,
  Button,
  Loader,
  Modal,
  Popover,
  Tooltip,
} from '@mantine/core';
import { CheckIcon } from '../icons/CheckIcon';
import { AlertIcon } from '../icons/AlertIcon';
import { useDisclosure } from '@mantine/hooks';
import { FoundUserProps } from '@/app/types/Accounts.types';
import { formatToName } from '@/app/helpers/formatToName';
import { FingerprintIcon } from '../icons/FingerprintIcon';

interface SupportListProps {
  loading: boolean;
  queries: SupportQueryProps[];
}

const SupportButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'>
>((props, ref) => {
  return (
    <button
      ref={ref}
      onClick={props.onClick}
      className="flex items-center rounded-lg border border-black/10 p-1 not-disabled:hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
      disabled={props.disabled}
    >
      <span className="text-[10px] truncate">{props.children}</span>
    </button>
  );
});

function UserProfile({ userId }: { userId: number }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<FoundUserProps | null>(null);

  async function getUser() {
    const response = await fetch('/api/dashboard/get-user', {
      body: JSON.stringify({
        userId: userId,
      }),
      method: 'POST',
    });

    if (response.ok) {
      setUser(await response.json());
    }
  }

  useEffect(() => {
    if (user !== null) return;
    getUser().finally(() => setLoading(false));
  }, [loading]);

  if (loading || user === null) {
    return (
      <div className="flex justify-center items-center w-30 h-15">
        <Loader size={30} />
      </div>
    );
  }

  let fullName = `${user.first_name} ${user.last_name}`;
  return (
    <div className="flex flex-col min-w-30 h-15">
      <div className="flex flex-row gap-2 items-center">
        <Avatar key={fullName} name={fullName} color="initials" size={35} />
        <h2 className="font-semibold text-sm">
          {formatToName(user.first_name)} {formatToName(user.last_name)}
        </h2>
        {user.is_staff ? (
          <Badge color="blue" variant="light">
            Staff
          </Badge>
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-row gap-2 h-5 w-full">
        {!user.requires_assistance ? (
          <h2 className="flex flex-row gap-1 text-[10px] text-black/40 items-center">
            <CheckIcon size={10} strokeWidth={3} />
            Requires assistance
          </h2>
        ) : (
          <></>
        )}
        {!user.wheelchair ? (
          <h2 className="flex flex-row gap-1 text-[10px] text-black/40 items-center">
            <CheckIcon size={10} strokeWidth={3} />
            Wheelchair
          </h2>
        ) : (
          <></>
        )}
      </div>
      <h2 className="flex flex-row gap-1 text-[10px] text-black/40 items-center">
        <FingerprintIcon size={10} strokeWidth={3} />
        User ID: #{user.user_id}
      </h2>
    </div>
  );
}

function Query(query: SupportQueryProps & { key: number }) {
  const [expanded, { open, close }] = useDisclosure(false);
  const [profileOpened, setProfileOpened] = useState<boolean>(false);
  const [claimed, setClaimed] = useState<boolean>(query.claimed_id !== 0);

  let isGrey = query.key % 2 == 0;

  async function claimQuery() {
    if (claimed) return;

    try {
      const response = await fetch('/api/support/claim-query', {
        body: JSON.stringify({
          messageId: query.message_id,
        }),
        method: 'POST',
      });

      if (response.ok) {
        setClaimed(true);
        alert('Successfully claimed query.');
      } else {
        alert('Could not claim at this time.');
      }
    } catch {
      alert('Could not claim at this time.');
    }
  }

  return (
    <>
      <Modal opened={expanded} onClose={close} title="Support Query" centered>
        <div className="w-full h-full p-2">
          <h2 className="text-normal text-black/80">
            {query.message.contents}
          </h2>
        </div>
      </Modal>
      <div
        className={`flex flex-row gap-2 select-none items-center rounded-sm text-sm font-medium h-7 w-full ${isGrey ? 'bg-black/5 hover:bg-white' : 'bg-white hover:bg-black/5'}`}
      >
        {claimed ? (
          <Tooltip label="Claimed by staff member">
            <div className="w-5 text-gg-green">
              <CheckIcon size={13} strokeWidth={2.5} />
            </div>
          </Tooltip>
        ) : (
          <Tooltip label="Unclaimed">
            <div className="w-5 text-black">
              <AlertIcon size={13} strokeWidth={2.5} />
            </div>
          </Tooltip>
        )}
        <div
          className={`w-75 truncate ${claimed ? 'font-normal' : 'font-medium'}`}
        >
          {query.message.contents}
        </div>
        <div className="flex justify-end gap-1 w-full h-full">
          <Tooltip label="Notify other staff you are answering this query">
            <div>
              <SupportButton onClick={claimQuery} disabled={claimed}>
                Claim this query
              </SupportButton>
            </div>
          </Tooltip>
          <SupportButton onClick={open} disabled={false}>
            Open full query
          </SupportButton>
          <Popover opened={profileOpened} onChange={setProfileOpened}>
            <Popover.Target>
              <SupportButton
                onClick={() => setProfileOpened((opened) => !opened)}
                disabled={false}
              >
                View user
              </SupportButton>
            </Popover.Target>

            <Popover.Dropdown>
              <UserProfile userId={query.author_id} />
            </Popover.Dropdown>
          </Popover>
        </div>
      </div>
    </>
  );
}

export function QueryList(props: SupportListProps) {
  let queries = props.queries.length > 0;
  return (
    <div className="flex flex-col w-full p-1 max-h-200 overflow-y-auto bg-white rounded-md shadow-sm border border-black/20">
      {props.loading ? (
        <div className="flex justify-center items-center w-full h-full">
          <Loader size={30} />
        </div>
      ) : (
        <>
          {queries ? (
            props.queries.map((query, index) => {
              return <Query {...query} key={index} />;
            })
          ) : (
            <div className="flex justify-center items-center w-full h-40">
              <h2 className="text-lg font-semimedium">
                No support queries yet...
              </h2>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SupportPage() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function getSupportQueries() {
    try {
      const response = await fetch('/api/support/get-support-queries', {
        method: 'GET',
      });

      if (!response.ok) {
        setQueries([]);
        return;
      }

      setQueries(await response.json());
    } catch {
      setQueries([]);
    }
  }

  useEffect(() => {
    setLoading(true);
    getSupportQueries().finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col w-full gap-2">
      <DashboardPageTitle
        icon={<InboxIcon size={25} strokeWidth={2} />}
        title="Support"
        description="View support queries."
      />
      <QueryList loading={loading} queries={queries} />
    </div>
  );
}
