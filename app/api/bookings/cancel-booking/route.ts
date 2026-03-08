import { calculateCost } from '@/app/helpers/calculateCost';
import { AirplaneProps, Airplanes } from '@/app/models/Airplanes';
import {
  BookingProps,
  Bookings,
  BookingSubmission,
} from '@/app/models/Bookings';
import { FlightProps, Flights } from '@/app/models/Flights';
import {
  TransactionMetadata,
  Transactions,
  TransactionsProps,
} from '@/app/models/Transactions';
import { connectDB } from '@/lib/mongoose';
import { createTransactionID, createTransactionLog } from '@/lib/transactions';
import { signIntoAccountWithCookie } from '@/lib/userAccount';

export async function POST(request: Request) {
  await connectDB();

  const { bookingId } = await request.json();
  const account = await signIntoAccountWithCookie();

  if (!account) {
    return Response.json(
      {
        ok: false,
        message: 'User is not logged in.',
      },
      {
        status: 401,
      }
    );
  }

  // Find the booking first
  const booking: BookingProps = await Bookings.findOne({
    booking_id: bookingId,
  }).exec();

  if (!booking) {
    return Response.json(
      {
        ok: false,
        message: 'Booking does not exist.',
      },
      {
        status: 400,
      }
    );
  }

  // Check this booking is the users
  if (booking.user_id !== account.user_id) {
    return Response.json(
      {
        ok: false,
        message: 'User is not authenticated to make this change.',
      },
      {
        status: 400,
      }
    );
  }

  // Cancel the booking and remove any
  // associated records with it
  try {
    const deleted = await Bookings.deleteOne({
      booking_id: bookingId,
    }).exec();

    if (!deleted) {
      return Response.json(
        {
          ok: false,
          message: "Couldn't cancel this booking.",
        },
        {
          status: 500,
        }
      );
    }

    // Report the cancellation through transactions
    // as we will remember the transaction booking but
    // will need to report the cancellation
    const originalBooking: TransactionsProps = await Transactions.findOne({
      flight_id: booking.flight_id,
      user_id: account.user_id,
      type: 'booking',
    }).exec();

    if (originalBooking) {
      const id = await createTransactionID(account.user_id);
      await new Transactions({
        transaction_id: id,
        flight_id: booking.flight_id,
        user_id: booking.user_id,
        type: 'cancellation',
        amount: originalBooking.amount,
        timestamp: new Date().getTime(),

        metadata: {},
      }).save();
    }
  } catch {
    return Response.json(
      {
        ok: false,
        message: 'Unexpected error occurred.',
      },
      {
        status: 500,
      }
    );
  }

  return Response.json(
    {
      ok: true,
      message: 'Successfully cancelled booking.',
    },
    {
      status: 200,
    }
  );
}
