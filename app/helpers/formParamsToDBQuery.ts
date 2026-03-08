import { DBSearchQuery } from '../types/Flights.types';
import {
  MINIMUM_FLIGHT_PRICE,
  MAXIMUM_FLIGHT_PRICE,
} from '@/app/consts/FlightSettings.json';

export function formParamsToDBQuery(query: DBSearchQuery) {
  const minDate = query.min_date
    ? new Date(query.min_date as string)
    : new Date();
  const maxDate = query.max_date
    ? new Date(query.max_date as string)
    : undefined;

  let departure_date: Record<string, Date> = {
    $gte: minDate,
  };

  if (maxDate) {
    departure_date['$lte'] = maxDate;
  }

  const dbQuery: any = {
    'flight_info.base_price': {
      $gte: Number(query.min_price) || MINIMUM_FLIGHT_PRICE,
      $lte: Number(query.max_price) || MAXIMUM_FLIGHT_PRICE,
    },
    'flight_info.departure_date': departure_date,
  };

  if (typeof query.sells_food == 'boolean') {
    dbQuery['flight_info.sells_food'] = query.sells_food;
  }

  const location = query.location == '' ? undefined : query.location;

  if (location) {
    dbQuery.$or = [
      { 'flight_info.arrival_location': new RegExp(location, 'i') },
      { 'flight_info.departure_location': new RegExp(location, 'i') },
    ];
  }

  return dbQuery;
}
