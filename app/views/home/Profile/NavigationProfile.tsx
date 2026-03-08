'use client';

import { Avatar, Badge } from '@mantine/core';
import { useEffect, useState } from 'react';
import Dropdown from '../../dropdown/Dropdown';
import { ConfigIcon } from '../../icons/ConfigIcon';
import { AccountActionIcon } from '../../icons/AccountActionIcon';
import { InboxIcon } from '../../icons/InboxIcon';
import { HistoryIcon } from '../../icons/HistoryIcon';
import { useRouter } from 'next/navigation';
import { getTimeOfDay } from '@/app/helpers/getTimeOfDay';
import { formatToName } from '@/app/helpers/formatToName';

export default function NavigationProfile({
  first_name,
  last_name,
  is_staff,
  is_admin,
}: {
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_admin: boolean;
}) {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    getUnreadMessages()
      .then((count) => setUnreadCount(count))
      .catch(() => setUnreadCount(0));
  }, []);

  let message = `Good ${getTimeOfDay()}, ${formatToName(first_name)}`;
  let fullName = first_name + ' ' + last_name;

  async function logOut() {
    try {
      let response = await fetch('/api/accounts/logout', {
        method: 'POST',
      });

      const result = await response.json();
      if (!response.ok) {
        console.log(result.message);
        return;
      }

      router.push('/');
    } catch (err: Error | any) {
      let message = err?.message;
      console.log(message || 'Encountered unknown error.');
    }
  }

  async function getUnreadMessages() {
    try {
      const response = await fetch('/api/dashboard/get-unread-messages-count', {
        method: 'GET',
      });

      if (!response.ok) {
        return 0;
      }

      const { count } = await response.json();
      return count;
    } catch {
      return 0;
    }
  }

  return (
    <div className="flex flex-row items-center gap-2">
      {is_admin ? (
        <Badge variant="light" color="red">
          Admin
        </Badge>
      ) : is_staff ? (
        <Badge variant="light" color="blue">
          Staff
        </Badge>
      ) : (
        <></>
      )}
      <div className="text-lg font-semibold text-black">{message}</div>
      <a href="/account" rel="noreferrer" onMouseEnter={() => setHovered(true)}>
        <Avatar key={fullName} name={fullName} color="initials" size={35} />
      </a>
      <Dropdown opened={hovered} onMouseLeave={() => setHovered(false)}>
        <Dropdown.Option href="/account">
          <ConfigIcon size={15} strokeWidth={2} />
          <h2>Account</h2>
        </Dropdown.Option>
        <Dropdown.Option href="/inbox">
          <InboxIcon size={15} strokeWidth={2} />
          <h2>Inbox</h2>
          {unreadCount > 0 ? (
            <h2 className="flex justify-center items-center px-1 min-w-5 h-5 text-white font-semibold text-sm rounded-full bg-gg-green">
              {unreadCount}
            </h2>
          ) : (
            <></>
          )}
        </Dropdown.Option>
        <Dropdown.Option href="/account/history">
          <HistoryIcon size={15} strokeWidth={2} />
          <h2>History</h2>
        </Dropdown.Option>
        <Dropdown.Division />
        <Dropdown.Option color="red" onClick={logOut}>
          <AccountActionIcon size={15} strokeWidth={2} />
          <h2>Log out</h2>
        </Dropdown.Option>
      </Dropdown>
    </div>
  );
}
