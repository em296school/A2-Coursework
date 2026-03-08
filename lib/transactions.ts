import { BookingProps, BookingSubmission } from '@/app/models/Bookings';
import {
  TransactionMetadata,
  Transactions,
  TransactionType,
} from '@/app/models/Transactions';

// Create a composite key with the userId and the #Transactions + 1
export async function createTransactionID(userId: number) {
  let count = await Transactions.countDocuments();

  return `${count + 1}${userId}`;
}

export async function createTransactionLog(
  booking: BookingSubmission & { booking_id: string },
  type: TransactionType,
  amountDue: number,
  metadata: TransactionMetadata
): Promise<BookingProps> {
  const id = await createTransactionID(booking.user_id);

  // Create the transaction
  try {
    let doc = await new Transactions({
      transaction_id: id,
      flight_id: booking.flight_id,
      user_id: booking.user_id,
      type: type,
      amount: amountDue,
      timestamp: new Date().getTime(),

      metadata: metadata,
    }).save();

    if (!doc) {
      throw new Error('Could not create transaction.');
    }
  } catch {
    throw new Error('Could not create transaction.');
  }

  // Fill the booking_options:
  booking.booking_options = {
    meal_service:
      typeof booking.booking_options.meal_service == 'boolean'
        ? booking.booking_options.meal_service
        : false,
    extra_luggage:
      typeof booking.booking_options.extra_luggage == 'boolean'
        ? booking.booking_options.extra_luggage
        : false,
    early_boarding:
      typeof booking.booking_options.early_boarding == 'boolean'
        ? booking.booking_options.early_boarding
        : false,
  };

  return {
    ...booking,
    transaction_id: id,
  };
}
