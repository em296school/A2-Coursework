import { DBSearchQuery } from '@/app/types/Flights.types';
import {
  MINIMUM_FLIGHT_PRICE,
  MAXIMUM_FLIGHT_PRICE,
  ALLOWED_AIRPORTS,
} from '@/app/consts/FlightSettings.json';

function isValidDate(d: unknown): d is Date {
  return d instanceof Date && !isNaN(d.getTime());
}

export default function ValidateFlightSearchParams(
  data: DBSearchQuery | any
): boolean {
  // Check the price range
  let { min_price, max_price, min_date, max_date, sells_food } = data;

  if (sells_food && typeof sells_food !== 'boolean') return false;

  if (min_price && isNaN(min_price)) return false;
  if (max_price && isNaN(max_price)) return false;

  min_price = Number(min_price);
  max_price = Number(max_price);

  if (min_price < MINIMUM_FLIGHT_PRICE || max_price > MAXIMUM_FLIGHT_PRICE) {
    return false;
  }

  // Check the date range is allowed
  if (min_date) {
    if (!isValidDate(new Date(min_date))) return false;

    // Disallow old dates from now:
    if (new Date() > new Date(min_date)) return false;
  }

  if (max_date) {
    if (!isValidDate(new Date(max_date))) return false;

    // Disallow old dates from now, or if the max_date is less than the min_date:
    if (new Date() > new Date(max_date)) return false;
    if (min_date && new Date(min_date) > new Date(max_date)) return false;
  }
  // Can be searched
  return true;
}
