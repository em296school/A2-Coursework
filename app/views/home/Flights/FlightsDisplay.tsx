import { NextURLSearchParams } from '@/app/types/URLs.types';
import { DBSearchQuery } from '@/app/types/Flights.types';
import { FlightProps, Flights } from '@/app/models/Flights';
import Validator from '@/app/controllers/Validator/Validator';
import {
  FlightsMenu,
  FlightsList,
  FlightsMenuInner,
  FlightListOptionProps,
} from './FlightsMenu';
import { Search } from '../../Search';
import { formParamsToDBQuery } from '@/app/helpers/formParamsToDBQuery';
import { generateMessageId, sendInboxMessage } from '@/lib/inbox';
import { Transactions } from '@/app/models/Transactions';

export default async function FlightsDisplay({
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

  // Get all the raw flights:
  let flights: FlightProps[] = await Flights.find(dbSearchQuery).lean().exec();
  flights = await Promise.all(
    flights.map(async (value: FlightListOptionProps & { _id?: Object }) => {
      delete value._id;
      return value;
    })
  );

  // Group flights on the same day (with the same departures/arrivals) and create a count:
  let groupedFlights: Record<string, FlightListOptionProps> = {};
  for (let flight of flights) {
    const dateAsDayMonthYear = flight.flight_info.departure_date.toDateString();
    const { departure_location, arrival_location } = flight.flight_info;

    // Create a key so we reference based off several values:
    const key = dateAsDayMonthYear + departure_location + arrival_location;

    // Check if there are other flights on the same day
    if (Object.hasOwn(groupedFlights, key)) {
      // Increment the amount of flights
      if (
        groupedFlights[key].flightsThisDay &&
        groupedFlights[key].startsFrom
      ) {
        // Set the starting price (which is the lowest price out
        // of all the flights).
        if (groupedFlights[key].startsFrom > flight.flight_info.base_price) {
          groupedFlights[key].startsFrom = flight.flight_info.base_price;
        }

        groupedFlights[key].flightsThisDay++;
      }
      continue;
    }

    groupedFlights[key] = flight;
    groupedFlights[key].startsFrom = flight.flight_info.base_price;
    groupedFlights[key].flightsThisDay = 1;
  }

  let flightsArray: FlightListOptionProps[] = [];
  for (let flight of Object.values(groupedFlights)) {
    flightsArray.push(flight);
  }

  return (
    <FlightsMenu>
      <FlightsMenuInner>
        <Search href="/" />
        <FlightsList>{flightsArray}</FlightsList>
      </FlightsMenuInner>
      <div></div>
    </FlightsMenu>
  );
}
