import {
  BookingPreferencesOptions,
  UnevaluatedPreferences,
} from '../models/Bookings';

export function getBundlePreferences(
  preset: UnevaluatedPreferences
): BookingPreferencesOptions {
  let preferences: Record<string, string | boolean> = {};

  // Make the raw preferences into a form compatible with the
  // booking schema model in booking_options
  for (let value of Object.values(preset)) {
    preferences[value.OPTION[0]] = value.OPTION[1];
  }
  return preferences as unknown as BookingPreferencesOptions;
}
