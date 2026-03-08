import { AirplaneProps } from '../models/Airplanes';
import { FlightProps } from '../models/Flights';

export type DBSearchQuery = {
  location: string | undefined;
  min_date: string | undefined;
  max_date: string | undefined;
  min_price: string | undefined;
  max_price: string | undefined;
  sells_food: boolean | undefined;
};

export type BookingOption = FlightProps &
  AirplaneProps & {
    isCheapest?: boolean;
  };

export interface FlightEdits {
  flightId?: string;
  basePrice?: number;
}

export interface FlightCreationProps {
  airplane: string;
  departure_date: string;
  departure_location: string;
  arrival_location: string;
  base_price: string;
  sells_food: boolean;
}
