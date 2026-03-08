'use client';
import { BookingProps } from '@/app/models/Bookings';
import { FlightProps } from '@/app/models/Flights';
import { RightArrowIcon } from '../icons/RightArrowIcon';
import { getDaysHoursDelta } from '@/app/helpers/getDaysHoursDelta';
import { Loader, Modal, Notification, Rating, Tooltip } from '@mantine/core';
import { CrossIcon } from '../icons/CrossIcon';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';

const TWO_DAYS = 1000 * 60 * 60 * 24 * 2;

export default function UpcomingFlightCard(props: BookingProps & FlightProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [cancelled, setCancelled] = useState(false);
  const [loading, setLoading] = useState(false);

  let tryingToCancel = false;
  let cantBeCancelled =
    Math.abs(Date.now() - props.flight_info.departure_date.getTime()) <
    TWO_DAYS;

  async function tryCancel() {
    if (cancelled) return;
    if (cantBeCancelled) return;
    if (tryingToCancel) return;

    setLoading(true);
    tryingToCancel = true;

    let body = {
      bookingId: props.booking_id,
    };

    const response = await fetch('/api/bookings/cancel-booking', {
      body: JSON.stringify(body),
      method: 'POST',
    });

    close();
    tryingToCancel = false;

    if (response.ok) {
      setLoading(false);
      setCancelled(true);
    }
  }

  if (cancelled) return <></>;
  return (
    <>
      <Modal opened={opened} onClose={close} title={'Are you sure?'} centered>
        <div className="flex flex-col gap-8">
          <span className="text-md text-black/50">
            Are you sure you want to cancel this booking?
          </span>
          <div className="flex flex-row justify-center gap-2 w-full">
            <button
              onClick={tryCancel}
              className="rounded-lg text-white text-lg font-medium bg-button-success px-3 py-2 h-10 items-center shadow-black/20 hover:shadow-lg duration-150"
            >
              Cancel this flight
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
      <div className="flex flex-col bg-white rounded-lg shadow-md/10 shadow-black p-4 w-full h-30">
        {loading ? (
          <div className="flex justify-center items-center w-full h-full">
            <Loader />
          </div>
        ) : (
          <>
            <span className="text-[10px] text-black/50">
              (#{props.flight_id})
            </span>
            <h2 className="flex flex-row font-semimedium gap-2 text-lg w-full items-center">
              <span className="text-black/50">
                {props.flight_info.departure_location}
              </span>
              <RightArrowIcon size={25} strokeOpacity={0.5} />
              {props.flight_info.arrival_location}
            </h2>
            <h2 className="font-normal text-md text-black/50">
              Departing in {getDaysHoursDelta(props.flight_info.departure_date)}
            </h2>
            <div className="flex items-end h-full w-full">
              {cantBeCancelled ? (
                <h2 className="text-black/30 text-sm">
                  This flight cannot be cancelled
                </h2>
              ) : (
                <button
                  onClick={open}
                  className="flex flex-row px-1 gap-1 bg-white text-red-400 rounded-lg items-center hover:shadow-md hover:outline hover:outline-current duration-150"
                >
                  <CrossIcon size={15} strokeWidth={2.5} />
                  Cancel this flight
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
