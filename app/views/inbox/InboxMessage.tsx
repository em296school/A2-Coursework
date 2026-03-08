'use client';

import { getDaysHoursDelta } from '@/app/helpers/getDaysHoursDelta';
import { FingerprintIcon } from '../icons/FingerprintIcon';
import { HistoryIcon } from '../icons/HistoryIcon';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import { InboxProps } from '@/app/models/Inboxes';
import { useState } from 'react';

export function InboxMessage(props: InboxProps) {
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  async function markMessageAsRead() {
    await fetch('/api/dashboard/read-message', {
      body: JSON.stringify({
        messageId: props.message_id,
      }),
      method: 'POST',
    });
  }

  function openAndRead() {
    open();
    setHasBeenOpened(true);
    markMessageAsRead();
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={props.message.title}
        centered
      >
        <div className="text-black/50 text-sm w-full h-full">
          {props.message.contents}
        </div>
      </Modal>
      <div
        onClick={openAndRead}
        className="flex flex-col w-full h-25 px-2 py-3 rounded-sm shadow-sm border border-black/5 hover:border-black/25 duration-150"
      >
        <div className="flex flex-row gap-1 w-full">
          {props.unread && !hasBeenOpened ? (
            <h2 className="h-5 px-1 text-sm text-white bg-gg-green rounded-full font-semibold">
              UNREAD
            </h2>
          ) : (
            <></>
          )}
          <h2 className="text-md text-black font-medium w-[90%] h-5 truncate">
            {props.message.title}
          </h2>
        </div>
        <div className="text-black/50 text-sm h-9 w-[50%] truncate">
          {props.message.contents}
        </div>
        <div className="flex flex-row text-black/50 gap-2 w-full h-5 items-center">
          <HistoryIcon size={13} strokeWidth={1.7} />
          <h2 className="text-xs font-normal">
            {getDaysHoursDelta(new Date(Number(props.timestamp)))} ago
          </h2>
          {props.author === 'system' ? (
            <div className="flex flex-row gap-1 items-center">
              <FingerprintIcon size={13} strokeWidth={1.7} />
              <h2 className="text-xs font-normal">System message</h2>
            </div>
          ) : (
            <div className="flex flex-row gap-1 items-center">
              <h2 className="text-xs font-normal">From: {props.author}</h2>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
