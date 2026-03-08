import { Schema, model, models } from 'mongoose';
import { SeatGroupType } from './Airplanes';
import { EssentialOptionsProps } from '../views/preferences/PreferencesEssentialOptions';
import { PersonOptionsProps } from '../views/preferences/PreferencesMenu';

export type BundleTypes = 'PREMIUM_PLUS' | 'PREMIUM' | 'BASIC';
export type UnevaluatedBookingOption = {
  TEXT: string;
  OPTION: [string, boolean | string];
};
export type UnevaluatedPreferences = [UnevaluatedBookingOption];
export interface BookingPreferencesOptions {
  early_boarding: boolean;
  meal_service: boolean;
  seat_group: SeatGroupType;
  extra_luggage: boolean;
}

export interface BookingSubmission {
  flight_id: string;
  user_id: number;

  booking_options: EssentialOptionsProps;
  person_options: PersonOptionsProps[];

  bundleType?: string;
  isBundle?: boolean;
}

export interface BookingProps {
  _id?: Object;
  booking_id: string;
  flight_id: string;
  transaction_id: string;
  user_id: number;

  booking_options: {
    meal_service: boolean;
    extra_luggage: boolean;
    early_boarding: boolean;
  };
  person_options: PersonOptionsProps[];
}

const BookingsSchema = new Schema<BookingProps>({
  booking_id: { type: String, required: true },
  flight_id: { type: String, required: true },
  transaction_id: { type: String, required: true },
  user_id: { type: Number, required: true },

  booking_options: {
    meal_service: { type: Boolean, required: true },
    extra_luggage: { type: Boolean, required: true },
    early_boarding: { type: Boolean, required: true },
  },

  person_options: [
    {
      first_name: { type: String, required: true },
      last_name: { type: String, required: true },
      seat: { type: String, required: true },
      requires_assistance: { type: Boolean, required: true },
      wheelchair: { type: Boolean, required: true },
    },
  ],
});

export const Bookings = models.Bookings || model('Bookings', BookingsSchema);
