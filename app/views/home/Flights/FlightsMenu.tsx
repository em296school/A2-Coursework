'use client';
import { FlightProps } from '@/app/models/Flights';
import React from 'react';
import { AirplaneProps } from '@/app/models/Airplanes';
import { AirplaneIcon } from '../../icons/AirplaneIcon';
import { RightArrowIcon } from '../../icons/RightArrowIcon';
import { ClockIcon } from '../../icons/ClockIcon';
import { UsersIcon } from '../../icons/UsersIcon';
import { LayersIcon } from '../../icons/LayersIcon';
import { useRouter } from 'next/navigation';
import { dateToShortString } from '@/app/helpers/dateToShortString';
import { CrossIcon } from '../../icons/CrossIcon';

// Types
export interface FlightsMenuProps {
  children: React.ReactElement[];
}

export interface FlightsMenuInnerProps {
  children: React.ReactElement[];
}

export type FlightListOptionProps = FlightProps & {
  flightsThisDay?: number;
  startsFrom?: number;
};

export interface FlightsMenuFlightsProps {
  children: FlightListOptionProps[];
}

// Component
export function FlightsMenu({ children }: FlightsMenuProps) {
  return (
    <div className="flex justify-center w-full mx-5 rounded-xl">{children}</div>
  );
}

export function Flight(props: FlightListOptionProps) {
  const router = useRouter();
  const hasDeparted = new Date() > new Date(props.flight_info.departure_date);
  const startsFrom = props.startsFrom || 0;
  const imagePath = `/cities/${props.flight_info.arrival_location.toLowerCase()}.png`;

  function beginBooking() {
    if (hasDeparted) return;
    router.push(
      `/booking?date=${props.flight_info.departure_date.getTime()}&departure=${props.flight_info.departure_location}&arrival=${props.flight_info.arrival_location}`
    );
  }

  return (
    <div
      onClick={beginBooking}
      className={`select-none group h-63 overflow-hidden bg-white shadow-md/10 rounded-lg outline-gg-green shadow-black w-83 hover:shadow-xl/20 transition-all duration-200 ${hasDeparted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      style={{
        opacity: hasDeparted ? 0.3 : 1,
      }}
    >
      <img
        src={imagePath}
        alt={props.flight_info.arrival_location}
        style={{
          maskImage: 'linear-gradient(to top, transparent, white 100%)',
        }}
      />
      <div className="p-3">
        <span className="flex flex-row font-bold text-xl items-center gap-2">
          <AirplaneIcon
            size={20}
            strokeWidth={0.1}
            className="pt-0.5 group-hover:rotate-360 transition-all duration-1000"
          />
          <h1 className="font-normal text-black/50">
            {props.flight_info.departure_location}
          </h1>
          <RightArrowIcon size={20} className="mx-2" />
          <h1>{props.flight_info.arrival_location}</h1>
        </span>
        <span className="text-black/50">
          Starts at{' '}
          <span className="text-gg-green font-medium">
            £{startsFrom.toFixed(2)}
          </span>
        </span>
        <span className="flex flex-row g-2 text-sm text-black/40 mt-3">
          <h2 className="flex items-start w-full">
            {dateToShortString(props.flight_info.departure_date)}
          </h2>
          {hasDeparted ? (
            <h2 className="flex items-center justify-end gap-2 w-full text-button-danger">
              <CrossIcon size={15} />
              Flight has departed
            </h2>
          ) : (
            <h2 className="flex items-center justify-end gap-2 w-full text-gg-green">
              <LayersIcon size={15} />
              {props.flightsThisDay || 0} flights available
            </h2>
          )}
        </span>
      </div>
    </div>
  );
}

export function FlightsList({ children }: FlightsMenuFlightsProps) {
  return (
    <div className="flex flex-wrap w-260 gap-2 rounded-lg px-3 py-4">
      {children.map((flight) => {
        return <Flight {...flight} />;
      })}
    </div>
  );
}

export function FlightsMenuInner({ children }: FlightsMenuInnerProps) {
  return <div className="flex flex-row gap-2">{children}</div>;
}
