'use client';
import { BookingOption } from '@/app/types/Flights.types';
import { Tooltip } from '@mantine/core';
import { NextIcon } from '../icons/NextIcon';
import { PreviousIcon } from '../icons/PreviousIcon';
import { FlightProps } from '@/app/models/Flights';
import { useState } from 'react';
import { getTimeOfDay } from '@/app/helpers/getTimeOfDay';
import { MoonIcon } from '../icons/MoonIcon';
import { SunIcon } from '../icons/SunIcon';
import { SunRiseIcon } from '../icons/SunRiseIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { RightArrowIcon } from '../icons/RightArrowIcon';
import { MapIcon } from '../icons/MapIcon';
import { dateToShortString } from '@/app/helpers/dateToShortString';
import { HistoryIcon } from '../icons/HistoryIcon';
import { AwardIcon } from '../icons/AwardIcon';
import { useRouter } from 'next/navigation';
import { getTimeAsAMPM } from '@/app/helpers/getTimeAsAMPM';
import { getSoldSeats } from '@/app/helpers/getSoldSeats';
import { BookingProps } from '@/app/models/Bookings';

const MAX_DISPLAY_AMOUNT = 3;

interface TimeSelectProps {
  children: BookingOption[];
  bookings: BookingProps[];
  departureLocation: string;
  arrivalLocation: string;
  date: Date;
}

export default function BookingTimeSelectMenu({
  children,
  bookings,
  departureLocation,
  arrivalLocation,
  date,
}: TimeSelectProps) {
  const router = useRouter();

  // Sort the booking options so the earliest time is
  // displayed first
  children.sort((a, b) => {
    return a.flight_info.departure_date > b.flight_info.departure_date ? 1 : -1;
  });

  const maxPages = Math.ceil(children.length / MAX_DISPLAY_AMOUNT);

  const [displayedFlights, setDisplayedFlights] = useState<BookingOption[]>([]);
  const [displayedPage, setDisplayedPage] = useState<number>(0);

  function updateFlights(n: number) {
    const { min, max } = sliceMinMax(n);
    setDisplayedFlights(children.slice(min, max));
  }

  function navigateBack() {
    let number = Math.max(1, displayedPage - 1);

    setDisplayedPage(number);
    updateFlights(number);
  }

  function navigateForward() {
    let number = Math.min(maxPages, displayedPage + 1);

    setDisplayedPage(number);
    updateFlights(number);
  }

  function sliceMinMax(n: number) {
    return {
      min: (n - 1) * MAX_DISPLAY_AMOUNT,
      max: n * MAX_DISPLAY_AMOUNT,
    };
  }

  function selectThisFlight(n: string) {
    router.push(`/booking?id=${n}`);
  }

  // Set the displayed flights:
  if (displayedPage == 0) {
    setDisplayedPage(1);
    updateFlights(1);
  }

  const moreThanOnePage = maxPages > 1;
  return (
    <>
      <div className="flex flex-col gap-1 w-full h-27 rounded-2xl shadow-lg border-2 border-gray-200 p-3">
        <h2 className="flex flex-row gap-3 text-[25px] font-semibold items-center">
          <span>{departureLocation}</span>
          <RightArrowIcon size={37} />
          <span>{arrivalLocation}</span>
          <div className="flex justify-end w-full">
            <a
              href="/"
              rel="noreferrer"
              className="text-[16px] text-black/50 font-medium pr-3 mb-3 hover:text-black"
            >
              Go back to flights
            </a>
          </div>
        </h2>
        <h2 className="flex flex-row gap-1 text-lg font-normal text-black/60 items-center">
          <HistoryIcon size={20} strokeWidth={2} />
          {dateToShortString(date)}
        </h2>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-row items-center gap-5">
          {moreThanOnePage ? (
            <Tooltip label="Show previous" withArrow>
              <button
                className="group bg-white rounded-2xl shadow-lg p-3"
                onClick={navigateBack}
              >
                <PreviousIcon
                  size={30}
                  strokeWidth={2}
                  className="group-hover:p-0.75 transition-all duration-150"
                />
              </button>
            </Tooltip>
          ) : (
            <></>
          )}
          <div className="flex flex-row justify-center shadow-lg rounded-2xl">
            {displayedFlights.map((flight, index) => {
              let isGrey = index % 2;

              let max_capacity = flight.column_amount * 26;

              // Check if this flight is the last on the displayed page
              let isLast = index == displayedFlights.length - 1;
              let isOnly = index == 0 && displayedFlights.length == 1;
              let rounded = isOnly
                ? 'rounded-2xl'
                : index == 0
                  ? 'rounded-l-2xl'
                  : isLast
                    ? 'rounded-r-2xl'
                    : '';

              // Get the info for the element
              let soldSeats = getSoldSeats(flight.flight_id, bookings);
              let isAlmostSoldOut =
                Number(soldSeats) / Number(max_capacity) > 0.8;

              let isCheapest = flight.isCheapest;
              let departureDate = flight.flight_info.departure_date;
              let timeOfDay = getTimeOfDay(departureDate);
              let icon =
                timeOfDay == 'evening' ? (
                  <MoonIcon strokeWidth={2} />
                ) : timeOfDay == 'afternoon' ? (
                  <SunIcon strokeWidth={2} />
                ) : (
                  <SunRiseIcon strokeWidth={2} />
                );

              return (
                <div
                  key={index}
                  className={`flex flex-col justify-start pt-10 pb-20 items-center h-130 w-60 border-3 ${rounded}`}
                  style={{
                    background: (isGrey && '#eeeeee') || 'white',
                    borderColor: '#eeeeee',
                  }}
                >
                  {icon}
                  <h2 className="text-black/70 text-xl font-medium">
                    {getTimeAsAMPM(departureDate)}
                  </h2>
                  <h2 className="text-black/40 text-md">Departure time</h2>
                  <h2 className="text-3xl text-gg-green mt-4">
                    £{flight.flight_info.base_price.toFixed(2)}
                  </h2>
                  {isCheapest ? (
                    <h2 className="flex flex-row gap-1 items-center text-amber-600 text-md font-medium">
                      <AwardIcon size={15} strokeWidth={2} />
                      Best value
                    </h2>
                  ) : (
                    <></>
                  )}
                  <div className="flex flex-col gap-4 justify-end items-center h-full w-full">
                    <button
                      onClick={() => selectThisFlight(flight.flight_id)}
                      className="flex justify-center items-center bg-black/40 text-white text-xl py-2.5 px-8 shadow-lg rounded-xl hover:bg-gg-green hover:mb-0.5 transition-all duration-150"
                    >
                      <h2 className="font-semibold">Select</h2>
                    </button>
                    {isAlmostSoldOut ? (
                      <h2 className="flex items-end justify-center w-full text-red-400">
                        <span className="flex flex-row items-center gap-2">
                          <ClockIcon size={15} />
                          Only {Number(max_capacity) - soldSeats} seats left!
                        </span>
                      </h2>
                    ) : (
                      <h2 className="flex items-center justify-center gap-2 w-full text-gg-green">
                        <UsersIcon size={15} />
                        {soldSeats} seats sold
                      </h2>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {moreThanOnePage ? (
            <Tooltip label="Show next" withArrow>
              <button
                className="group bg-white rounded-2xl shadow-lg p-3"
                onClick={navigateForward}
              >
                <NextIcon
                  size={30}
                  strokeWidth={2}
                  className="group-hover:p-0.75 transition-all duration-150"
                />
              </button>
            </Tooltip>
          ) : (
            <></>
          )}
        </div>
      </div>
      <h2 className="text-lg text-black/50">
        Showing page {displayedPage} out of {maxPages}
      </h2>
    </>
  );
}
