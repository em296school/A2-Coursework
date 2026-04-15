import { Ref, useEffect, useRef, useState } from 'react';
import { UserIcon } from '../icons/UserIcon';
import { DashboardPageTitle } from './StaffDashboard';
import { AccountProps } from '@/app/models/Accounts';
import { Badge, Loader, Menu, Modal, Tooltip } from '@mantine/core';
import { FoundUserProps } from '@/app/types/Accounts.types';
import { formatToName } from '@/app/helpers/formatToName';
import { useDisclosure } from '@mantine/hooks';
import {
  MINIMUM_MESSAGE_LENGTH,
  MAXIMUM_MESSAGE_LENGTH,
} from '@/app/consts/DashboardSettings.json';

import Validator from '@/app/controllers/Validator/Validator';
import UserEditLayout, {
  AccountEditUserProps,
} from '../account/UserEditLayout';
import { ConfigIcon } from '../icons/ConfigIcon';
import { BriefcaseIcon } from '../icons/BriefcaseIcon';
import { MessageIcon } from '../icons/MessageIcon';
import { LayersIcon } from '../icons/LayersIcon';
import { DeleteIcon } from '../icons/DeleteIcon';
import { MoreIcon } from '../icons/MoreIcon';
import { FingerprintIcon } from '../icons/FingerprintIcon';
import { BookingProps } from '@/app/models/Bookings';
import { FlightProps } from '@/app/models/Flights';
import { RightArrowIcon } from '../icons/RightArrowIcon';
import { HistoryIcon } from '../icons/HistoryIcon';
import { getDaysHoursDelta } from '@/app/helpers/getDaysHoursDelta';

interface ListStateProps {
  users: FoundUserProps[];
  searchFilter: string;
  loading: boolean;
  isViewedByAdmin?: boolean;
}

interface SearchProps {
  ref: Ref<HTMLInputElement>;
  onSearch: () => void;
}

interface UsersLayoutProps {
  isViewedByAdmin?: boolean;
}

interface UsersPageProps {
  isViewedByAdmin?: boolean;
}

export function UsersLayout(props: UsersLayoutProps) {
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
    } catch (err: Error | any) {
      setUsers([]);
    }
  }

  useEffect(() => {
    setLoading(true);
    getUsersFromSearchFilter().finally(() => setLoading(false));
  }, [searchFilter]);

  return (
    <div className="flex flex-row gap-1 w-full h-20">
      <UsersList
        searchFilter={searchFilter}
        users={users}
        loading={loading}
        isViewedByAdmin={props.isViewedByAdmin}
      />
      <UsersSearch ref={searchRef} onSearch={onSearch} />
    </div>
  );
}

function UserButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center rounded-lg border border-black/10 p-1 not-disabled:hover:shadow-sm disabled:cursor-not-allowed"
      disabled={disabled}
    >
      <span className="text-[10px] truncate">{children}</span>
    </button>
  );
}

function User(account: FoundUserProps & { key: number; isDisabled?: boolean }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [infoOpened, infoHandler] = useDisclosure(false);
  const [messageOpened, messageHandler] = useDisclosure(false);
  const [closureOpened, closureHandler] = useDisclosure(false);
  const [makeStaffOpened, makeStaffHandler] = useDisclosure(false);
  const [bookingsOpened, bookingsHandler] = useDisclosure(false);

  const [menuOpened, setMenuOpened] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookings, setBookings] = useState<(BookingProps & FlightProps)[]>([]);

  let isStaff = account.is_staff;
  let isDisabled = account.isDisabled ? true : false;
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

    if (!validator.validateSendMessage()) {
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

  async function makeStaff() {
    const body = {
      userId: account.user_id,
    };

    try {
      const response = await fetch('/api/dashboard/make-staff', {
        body: JSON.stringify(body),
        method: 'POST',
      });

      if (!response.ok) {
        alert("Couldn't update user at this time.");
      } else {
        alert('Successfully promoted user.');
      }
    } catch {
      alert("Couldn't update user at this time.");
    }
  }

  async function openBookings() {
    const body = {
      userId: account.user_id,
    };

    bookingsHandler.open();
    function couldntGetBookings() {
      setLoadingBookings(false);
      bookingsHandler.close();

      alert("Couldn't get bookings at this time.");
    }

    if (bookings.length > 0 || loadingBookings) return;
    setLoadingBookings(true);

    try {
      const response = await fetch('/api/dashboard/get-bookings', {
        body: JSON.stringify(body),
        method: 'POST',
      });

      if (!response.ok) {
        couldntGetBookings();
        return;
      }

      const bookings = await response.json();
      setBookings(bookings);
      setLoadingBookings(false);
    } catch (err: Error | any) {
      console.log(err.message);
      couldntGetBookings();
    }
  }

  async function cancelBooking(booking_id: string) {
    const body = {
      bookingId: booking_id,
    };

    try {
      const response = await fetch('/api/dashboard/cancel-booking', {
        body: JSON.stringify(body),
        method: 'POST',
      });

      if (!response.ok) {
        alert('Could not delete booking at this time.');
        bookingsHandler.close();
        return;
      }

      alert('Cancelled booking.');

      bookingsHandler.close();
      // Force reload
      setBookings([]);
    } catch {
      alert('Could not delete booking at this time.');
      bookingsHandler.close();
    }
  }

  function innerBooking(props: BookingProps & FlightProps) {
    return (
      <div className="select-none flex flex-row gap-1 w-full p-1 text-sm text-black/80 rounded-sm hover:bg-black/5 duration-150">
        <div className="flex flex-row gap-3 w-200 items-center">
          {props.flight_info.departure_location}
          <RightArrowIcon size={20} strokeWidth={1.5} />
          {props.flight_info.arrival_location}
          <span className="flex flex-row gap-1 text-xs text-black/20 items-center">
            <HistoryIcon size={9} strokeWidth={2} />
            in {getDaysHoursDelta(new Date(props.flight_info.departure_date))}
          </span>
        </div>
        <div className="flex flex-row justify-end w-full">
          <UserButton
            onClick={() => cancelBooking(props.booking_id)}
            disabled={false}
          >
            Refund and cancel
          </UserButton>
        </div>
      </div>
    );
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

      <Modal
        opened={infoOpened}
        onClose={infoHandler.close}
        size={500}
        title={`Edit ${formatToName(account.first_name)} ${formatToName(account.last_name)}'s Account`}
        centered
      >
        <UserEditLayout
          props={account as AccountEditUserProps}
          inModal
          staffEditor
          isAdmin={!account.isDisabled && account.is_staff}
        />
      </Modal>

      <Modal
        opened={makeStaffOpened}
        onClose={makeStaffHandler.close}
        title={'Are you sure?'}
        centered
      >
        <div className="flex flex-col gap-2">
          <span className="text-md text-black/50">
            Are you sure you want to make {formatToName(account.first_name)}{' '}
            {formatToName(account.last_name)} staff?
          </span>
          <div className="flex flex-col my-2 gap-2">
            <span className="text-sm text-black/50">
              They will receive the following privileges:
            </span>
            <div className="flex flex-col">
              <div className="w-full text-sm p-1.5 text-black/40 bg-black/5">
                Create/edit/cancel flights
              </div>
              <div className="w-full text-sm p-1.5 text-black/40">
                Edit/close user accounts
              </div>
              <div className="w-full text-sm p-1.5 text-black/40 bg-black/5">
                Message user accounts
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-center gap-2 w-full">
            <button
              onClick={makeStaff}
              className="rounded-lg text-white text-lg font-medium bg-button-success px-3 py-2 h-10 items-center shadow-black/20 hover:shadow-lg duration-150"
            >
              Make this user staff
            </button>
            <button
              onClick={makeStaffHandler.close}
              className="rounded-lg text-white text-lg font-medium bg-button-danger px-3 py-2 h-10 items-center shadow-black/20 hover:shadow-lg duration-150"
            >
              Nevermind
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        opened={bookingsOpened}
        onClose={bookingsHandler.close}
        size={400}
        title={`${formatToName(account.first_name)} ${formatToName(account.last_name)}'s Bookings`}
        centered
      >
        {loadingBookings ? (
          <div className="flex justify-center items-center w-full h-25">
            <Loader size={30} />
          </div>
        ) : (
          <div className="flex flex-col gap-1 w-full h-25 overflow-y-auto">
            {bookings.map((booking) => {
              return innerBooking(booking);
            })}
          </div>
        )}
      </Modal>

      <Menu
        shadow="sm"
        width={200}
        position="top-end"
        opened={menuOpened}
        onChange={setMenuOpened}
      >
        <Menu.Target>
          <div
            className={`flex flex-row gap-2 select-none items-center rounded-sm text-sm font-medium h-7 w-full ${isDisabled ? 'cursor-not-allowed text-black/20' : `cursor-pointer text-black/70 ${isGrey ? 'bg-black/5 hover:bg-white' : 'bg-white hover:bg-black/5'}`}`}
          >
            {isStaff ? (
              <div className="w-50">
                <Badge variant="light" color="blue">
                  Staff
                </Badge>
              </div>
            ) : (
              <div className="w-50"></div>
            )}
            <div className="w-5">
              <UserIcon size={13} strokeWidth={2} />
            </div>
            <div className="w-200">
              {account.last_name.toUpperCase()},{' '}
              {formatToName(account.first_name)}
            </div>
            <div className="flex justify-end gap-1 w-full h-full">
              <Tooltip label="More options">
                <button onClick={() => setMenuOpened(!menuOpened)}>
                  <MoreIcon size={13} strokeWidth={2} />
                </button>
              </Tooltip>
            </div>
          </div>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>User</Menu.Label>
          <Menu.Item
            leftSection={<BriefcaseIcon size={13} strokeWidth={2} />}
            onClick={openBookings}
            //disabled={account.is_staff}
          >
            View bookings
          </Menu.Item>
          <Menu.Item
            leftSection={<MessageIcon size={13} strokeWidth={2} />}
            onClick={messageHandler.open}
          >
            Send message
          </Menu.Item>
          <Menu.Divider />
          <Menu.Label>Account</Menu.Label>
          <Menu.Item
            leftSection={<LayersIcon size={13} strokeWidth={2} />}
            onClick={infoHandler.open}
            disabled={isDisabled}
          >
            Change info
          </Menu.Item>
          <Menu.Item
            leftSection={<FingerprintIcon size={13} strokeWidth={2} />}
            onClick={makeStaffHandler.open}
            disabled={isDisabled || account.is_staff}
          >
            Make staff account
          </Menu.Item>
          <Menu.Item
            leftSection={<DeleteIcon size={13} strokeWidth={2} />}
            disabled={isDisabled}
            onClick={closureHandler.open}
            color="red"
          >
            Close account
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}

export function UsersList(props: ListStateProps) {
  return (
    <div className="flex flex-col w-120 p-1 h-100 max-h-150 overflow-y-auto bg-white rounded-md shadow-sm border border-black/20">
      {props.loading ? (
        <div className="flex justify-center items-center w-full h-full">
          <Loader size={30} />
        </div>
      ) : (
        props.users.map((account, index) => {
          return (
            <User
              {...account}
              key={index}
              isDisabled={!props.isViewedByAdmin && account.is_staff}
            />
          );
        })
      )}
    </div>
  );
}

export function UsersSearch(props: SearchProps) {
  return (
    <div className="flex flex-col w-60 py-1 px-2 h-50 bg-white rounded-md shadow-sm border border-black/20">
      <div className="flex flex-col text-xs gap-2">
        <h2 className="text-xs text-black/20 font-bold">SEARCH</h2>
        <input
          ref={props.ref}
          className="border outline-none border-black/20 py-1 px-1 shadow-sm bg-white rounded-sm text-black text-sm font-normal w-full overflow-y-hidden"
          placeholder="Search for name, email or user ID"
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

export default function UsersPage(props: UsersPageProps) {
  return (
    <div className="flex flex-col w-full gap-2">
      <DashboardPageTitle
        icon={<UserIcon size={25} strokeWidth={2} />}
        title="Users"
        description="Manage users."
      />
      <UsersLayout isViewedByAdmin={props.isViewedByAdmin} />
    </div>
  );
}
