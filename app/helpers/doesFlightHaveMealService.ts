import { FlightProps } from '../models/Flights';

export function doesFlightHaveMealService(flight: FlightProps): boolean {
  return flight.flight_info.sells_food ? true : false;
}
