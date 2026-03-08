import { AccountProps } from '../models/Accounts';
import { AirplaneProps } from '../models/Airplanes';
import {
  BookingPreferencesOptions,
  BookingProps,
  Bookings,
} from '../models/Bookings';
import { FlightProps } from '../models/Flights';
import { EssentialOptionsProps } from '../views/preferences/PreferencesEssentialOptions';
import { PersonOptionsProps } from '../views/preferences/PreferencesMenu';
import { getFirstSeatAvailableInSeatGroup } from './getSeats';

type IncompleteBooking = Omit<BookingProps, 'transaction_id'>;

export function getBookingFromBundle(
  account: AccountProps,
  flight: FlightProps,
  airplane: AirplaneProps,
  bookings: BookingProps[],
  preferences: BookingPreferencesOptions
) {
  // We need to get the seat as this is from a bundle so we are selecting
  // the seat for them
  let seat = getFirstSeatAvailableInSeatGroup(
    flight,
    airplane,
    bookings,
    preferences.seat_group
  );

  if (!seat) {
    throw new Error('No seat available');
  }

  let person = {
    first_name: account.first_name,
    last_name: account.last_name,
    seat: seat as string,
    requires_assistance:
      typeof account.requires_assistance == 'boolean'
        ? account.requires_assistance
        : false,
    wheelchair:
      typeof account.wheelchair == 'boolean' ? account.wheelchair : false,
  };
  return {
    user_id: account.user_id,
    flight_id: flight.flight_id,

    booking_options: {
      meal_service: preferences.meal_service,
      extra_luggage: preferences.extra_luggage,
      early_boarding: preferences.early_boarding,
    },
    person_options: [person],
  };
}

export function getBookingFromSelection(
  account: AccountProps,
  bookings: BookingProps[],
  flight: FlightProps,
  people: PersonOptionsProps[],
  preferences: EssentialOptionsProps
) {
  people = people.map((person) => {
    delete person.key;
    return person;
  });

  return {
    user_id: account.user_id,
    flight_id: flight.flight_id,

    booking_options: {
      meal_service: preferences.meal_service,
      extra_luggage: preferences.extra_luggage,
      early_boarding: preferences.early_boarding,
    },
    person_options: people,
  };
}
