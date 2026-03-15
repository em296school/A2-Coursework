import Validator from '@/app/controllers/Validator/Validator';
import { formatToName } from '@/app/helpers/formatToName';
import { BookingProps, Bookings } from '@/app/models/Bookings';
import { FlightProps, Flights } from '@/app/models/Flights';
import { Transactions, TransactionsProps } from '@/app/models/Transactions';
import { FlightEdits } from '@/app/types/Flights.types';
import { generateMessageId, sendInboxMessage } from '@/lib/inbox';
import { connectDB } from '@/lib/mongoose';
import { createTransactionID } from '@/lib/transactions';
import { signIntoAccountWithCookie } from '@/lib/userAccount';

function createRefundMessage(booking: BookingProps, flight: FlightProps) {
  return `Your flight from ${flight.flight_info.departure_location} to ${flight.flight_info.arrival_location} on ${flight.flight_info.departure_date.toDateString()} at ${flight.flight_info.departure_date.toLocaleTimeString()} has been cancelled by a staff member. Your account has been refunded appropriately.`;
}

export async function POST(request: Request) {
  await connectDB();

  const { bookingId }: { bookingId: string } = await request.json();
  const account = await signIntoAccountWithCookie();

  if (!account || (account && !account.is_admin)) {
    return Response.json(
      {
        ok: false,
        message: 'User is not authenticated.',
      },
      {
        status: 401,
      }
    );
  }

  // Try find the booking, and if so cancel and notify
  // the user
  try {
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

    const flight_id = booking.flight_id;
    const recipient_id = booking.user_id;

    // Get the flight
    const flight = await Flights.findOne({
      flight_id: flight_id,
    }).exec();

    if (!flight) {
      return Response.json(
        {
          ok: false,
          message: 'Could not find any flight.',
        },
        {
          status: 500,
        }
      );
    }

    // Get their transaction information so we can
    // report a financial loss
    const originalBooking: TransactionsProps = await Transactions.findOne({
      flight_id: booking.flight_id,
      user_id: booking.user_id,
      type: 'booking',
    }).exec();

    if (originalBooking) {
      const id = await createTransactionID(booking.user_id);
      await new Transactions({
        transaction_id: id,
        flight_id: booking.flight_id,
        user_id: booking.user_id,
        type: 'refund',
        amount: originalBooking.amount,
        timestamp: new Date().getTime(),

        metadata: {},
      }).save();
    }

    // Delete it
    const deleted = await Bookings.findByIdAndDelete(booking._id).exec();

    if (!deleted) {
      return Response.json(
        {
          ok: false,
          message: 'Could not delete at this time.',
        },
        {
          status: 500,
        }
      );
    }

    await sendInboxMessage(recipient_id, {
      author: 'system',
      message_id: await generateMessageId(recipient_id, account.user_id),
      timestamp: new Date().getTime(),
      unread: true,
      message: {
        title: 'Flight refund',
        contents: createRefundMessage(booking, flight),
      },
    });
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
      message: 'Successfully cancelled flight.',
    },
    {
      status: 200,
    }
  );
}
