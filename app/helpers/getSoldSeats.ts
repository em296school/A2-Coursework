import { BookingProps } from '../models/Bookings';

export function getSoldSeats(flightId: string, bookings: BookingProps[]) {
  let bookingsForFlight = bookings.filter((booking) => {
    return booking.flight_id == flightId;
  });

  let runningCount = 0;

  // Calculate the amount of sold seats (there can be many
  // seats per booking)
  for (let booking of bookingsForFlight) {
    runningCount += booking.person_options.length;
  }

  return runningCount;
}
