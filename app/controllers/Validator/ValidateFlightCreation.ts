import { FlightCreationProps } from '@/app/types/Flights.types';
import {
  ALLOWED_AIRPORTS,
  MINIMUM_FLIGHT_PRICE,
  MAXIMUM_FLIGHT_PRICE,
} from '@/app/consts/FlightSettings.json';

export default function ValidateFlightCreation(
  data: FlightCreationProps | any
) {
  if (!data || typeof data !== 'object') return false;

  const fields = <FlightCreationProps>data;
  const { departure_date, departure_location, arrival_location, base_price } =
    fields;

  // Cannot create a booking that departs before today (always expired)
  if (new Date(departure_date) < new Date()) {
    return false;
  }

  // Check the locations
  if (
    !ALLOWED_AIRPORTS.includes(departure_location) ||
    !ALLOWED_AIRPORTS.includes(arrival_location)
  ) {
    return false;
  }

  // Check the base price
  if (Number.isNaN(Number(base_price))) return false;
  const price = Number(base_price);

  if (price < MINIMUM_FLIGHT_PRICE || price > MAXIMUM_FLIGHT_PRICE) {
    return false;
  }

  // If we've made it to here then we're clear
  return true;
}
