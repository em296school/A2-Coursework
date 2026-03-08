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

function createCancellationMessage(booking: BookingProps, flight: FlightProps) {
  return `Your flight from ${flight.flight_info.departure_location} to ${flight.flight_info.arrival_location} on ${flight.flight_info.departure_date.toDateString()} at ${flight.flight_info.departure_date.toLocaleTimeString()} has been cancelled due to unforeseen circumstances. Your account has been refunded appropriately. We apologise for this inconvenience!`;
}

export async function POST(request: Request) {
  await connectDB();

  const req = await request.json();
  const account = await signIntoAccountWithCookie();

  if (!account || (account && !account.is_staff)) {
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
  // Deconstruct the edits for easier access
  let { flightId } = req;

  // Try find the flight and if so, cancel it
  // and notify all bookings subscribed to it
  try {
    const flight = await Flights.findOne({
      flight_id: flightId,
    }).exec();

    if (!flight) {
      return Response.json(
        {
          ok: false,
          message: 'Flight does not exist.',
        },
        {
          status: 400,
        }
      );
    }

    // Delete it
    const deleted = await Flights.findByIdAndDelete(flight._id).exec();

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

    // Notify all people who have booked it
    const bookedAccounts: BookingProps[] = await Bookings.find({
      flight_id: flightId,
    }).exec();

    bookedAccounts.forEach(async (booking) => {
      let recipient_id = booking.user_id;

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

      await Bookings.deleteOne({ _id: booking._id }).exec();

      await sendInboxMessage(recipient_id, {
        author: 'system',
        message_id: await generateMessageId(0, account.user_id),
        timestamp: new Date().getTime(),
        unread: true,
        message: {
          title: 'Flight cancellation',
          contents: createCancellationMessage(booking, flight),
        },
      });
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
