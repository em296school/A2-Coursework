import Validator from '@/app/controllers/Validator/Validator';
import { formParamsToDBQuery } from '@/app/helpers/formParamsToDBQuery';
import { DBSearchQuery } from '@/app/types/Flights.types';
import { NextURLSearchParams } from '@/app/types/URLs.types';
import { Search } from '../Search';
import { BookingProps, Bookings } from '@/app/models/Bookings';
import { signIntoAccountWithCookie } from '@/lib/userAccount';
import { AccountProps } from '@/app/models/Accounts';
import { FlightProps, Flights } from '@/app/models/Flights';
import { HistoryIcon } from '../icons/HistoryIcon';
import { BriefcaseIcon } from '../icons/BriefcaseIcon';

import HistoryLayout from './HistoryLayout';
import ExpiredFlightCard from './ExpiredFlightCard';
import UpcomingFlightCard from './UpcomingFlightCard';

export default async function HistoryDisplay({
  searchParams,
}: {
  searchParams: NextURLSearchParams;
}) {
  const query = (await searchParams) as DBSearchQuery;

  // Check if the query is malformed
  // and if so do not apply a search filter:
  const check = new Validator(query);
  let dbSearchQuery = {};

  if (check.validateFlightSearchParams()) {
    // We can search with these params:
    dbSearchQuery = formParamsToDBQuery(query);
  }

  // Get the bookings for this user account
  const account: AccountProps | false = await signIntoAccountWithCookie();
  if (!account) {
    return <></>;
  }

  const bookings: BookingProps[] = await Bookings.find({
    user_id: account.user_id,
  })
    .lean()
    .exec();

  // Create a cache so we don't make unnecessary database
  // requests
  let cachedFlights: Record<string, FlightProps> = {};

  let upcomingBookings = [];
  let expiredBookings = [];

  for (let booking of bookings) {
    // Clean up the ids whilst we're at it
    delete booking._id;
    booking.person_options = booking.person_options.map((person) => {
      delete person._id;
      return person;
    });

    let departureDate;

    if (cachedFlights[booking.flight_id]) {
      departureDate =
        cachedFlights[booking.flight_id].flight_info.departure_date;
    } else {
      const flight: FlightProps = await Flights.findOne({
        flight_id: booking.flight_id,
      })
        .lean()
        .exec();

      if (flight) {
        departureDate = flight.flight_info.departure_date;

        // Cache
        delete flight._id;
        cachedFlights[booking.flight_id] = flight;
      }
    }

    if (!departureDate) continue;
    if (departureDate > new Date()) {
      upcomingBookings.push(booking);
    } else {
      expiredBookings.push(booking);
    }
  }

  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-row justify-center gap-4 w-[85%]">
        <Search href="/account/history/" />
        <div className="flex flex-row">
          <HistoryLayout
            title="Upcoming"
            icon={<BriefcaseIcon size={20} strokeWidth={2} />}
          >
            {upcomingBookings.map((booking) => {
              return (
                <UpcomingFlightCard
                  {...booking}
                  {...cachedFlights[booking.flight_id]}
                />
              );
            })}
          </HistoryLayout>
          <HistoryLayout
            title="Expired"
            icon={<HistoryIcon size={20} strokeWidth={2} />}
          >
            {expiredBookings.map((booking) => {
              return (
                <ExpiredFlightCard
                  {...booking}
                  {...cachedFlights[booking.flight_id]}
                />
              );
            })}
          </HistoryLayout>
        </div>
      </div>
    </div>
  );
}
