'use client';
import { BookingProps } from '@/app/models/Bookings';
import { FlightProps } from '@/app/models/Flights';
import { RightArrowIcon } from '../icons/RightArrowIcon';
import { getDaysHoursDelta } from '@/app/helpers/getDaysHoursDelta';
import { Rating, Tooltip } from '@mantine/core';
import { useState } from 'react';

export default function ExpiredFlightCard(props: BookingProps & FlightProps) {
  const [rated, setRated] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');

  async function rateFlight(n: number) {
    if (rated) return;

    let body = {
      flightId: props.flight_id,
      stars: n,
    };

    try {
      const response = await fetch('/api/bookings/star-rate', {
        body: JSON.stringify(body),
        method: 'POST',
      });

      let result = await response.json();
      if (!response.ok) {
        setResponse(result.message);
      } else {
        setResponse('Successfully submitted feedback.');
      }

      setRated(true);
    } catch (err: Error | any) {
      console.log(err.message);
    }
  }

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md/10 shadow-black p-4 w-full h-30">
      <span className="text-[10px] text-black/50">(#{props.flight_id})</span>
      <h2 className="flex flex-row font-semimedium gap-2 text-lg w-full items-center">
        <span className="text-black/50">
          {props.flight_info.departure_location}
        </span>
        <RightArrowIcon size={25} strokeOpacity={0.5} />
        {props.flight_info.arrival_location}
      </h2>
      <h2 className="font-normal text-md text-black/50">
        Departed {getDaysHoursDelta(props.flight_info.departure_date)} ago
      </h2>
      <div className="flex items-end h-full w-full">
        {rated ? (
          <h2 className="text-sm text-black/50">{response}</h2>
        ) : (
          <Tooltip label={'Rate your experience'}>
            <Rating defaultValue={0} onChange={rateFlight} />
          </Tooltip>
        )}
      </div>
    </div>
  );
}
