// Create a booking ID which includes the user_id to prevent
// duplicate bookings (composite key of the #bookings + user_id foreign key)

import { Bookings } from '../models/Bookings';

// also add the current epoch for data security
export async function generateBookingId(user_id: number) {
  const bookings = await Bookings.countDocuments().exec();
  let count = bookings + 1;
  return count.toString() + user_id.toString();
}
