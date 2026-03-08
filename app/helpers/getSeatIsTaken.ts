import { BookingProps, Bookings } from '../models/Bookings';

export async function getSeatIsTaken(seat: string, flight_id: string) {
  try {
    const bookings: BookingProps[] = await Bookings.find({
      flight_id: flight_id,
    }).exec();

    if (!bookings) {
      throw new Error('No bookings found.');
    }

    const seatExists = bookings.find((booking) => {
      return booking.person_options.find((person) => person.seat == seat);
    });

    return seatExists ? true : false;
  } catch {
    throw new Error("Couldn't get bookings.");
  }
}
