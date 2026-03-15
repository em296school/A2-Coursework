import { calculateCost } from '@/app/helpers/calculateCost';
import { formatToName } from '@/app/helpers/formatToName';
import { generateBookingId } from '@/app/helpers/getBookingId';
import { getSeatIsTaken } from '@/app/helpers/getSeatIsTaken';
import { AirplaneProps, Airplanes } from '@/app/models/Airplanes';
import { MAX_PASSENGERS } from '@/app/consts/PassengersSettings.json';
import {
  BookingProps,
  Bookings,
  BookingSubmission,
} from '@/app/models/Bookings';
import { FlightProps, Flights } from '@/app/models/Flights';
import { TransactionMetadata } from '@/app/models/Transactions';
import { generateMessageId, sendInboxMessage } from '@/lib/inbox';
import { connectDB } from '@/lib/mongoose';
import { createTransactionLog } from '@/lib/transactions';
import { signIntoAccountWithCookie } from '@/lib/userAccount';

function createNiceMessageForInbox(booking: BookingProps, flight: FlightProps) {
  // Get the people
  let peopleComma = '';
  let peopleGoing = 0;

  for (let person of booking.person_options) {
    peopleGoing++;
    peopleComma = peopleComma + formatToName(person.first_name) + ', ';
  }

  // Remove the last comma & whitespace
  peopleComma = peopleComma.trimEnd().slice(0, -1);
  let verb = peopleGoing > 1 ? 'are' : 'is';

  return `${peopleComma} ${verb} going to ${flight.flight_info.arrival_location} on ${flight.flight_info.departure_date.toDateString()} at ${flight.flight_info.departure_date.toLocaleTimeString()}!`;
}

export async function POST(request: Request) {
  await connectDB();

  const booking: BookingSubmission &
    Partial<TransactionMetadata> & { booking_id?: string } =
    await request.json();
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

  if (booking.user_id != account.user_id) {
    return Response.json(
      {
        ok: false,
        message: 'Account is not authenticated.',
      },
      {
        status: 400,
      }
    );
  }

  try {
    let isBundle = booking.isBundle;
    let bundleType = booking.bundleType;

    let flight: FlightProps | undefined = await Flights.findOne({
      flight_id: booking.flight_id,
    })
      .lean()
      .exec();

    if (!flight) {
      return Response.json(
        {
          ok: false,
          message: 'Encountered unexpected error in submission.',
        },
        {
          status: 500,
        }
      );
    }

    let airplane: AirplaneProps | undefined = await Airplanes.findOne({
      airplane_id: flight?.airplane_id,
    })
      .lean()
      .exec();

    if (!airplane) {
      return Response.json(
        {
          ok: false,
          message: 'Encountered unexpected error in submission.',
        },
        {
          status: 500,
        }
      );
    }

    // Check the booking preferences are available:
    // Meal service is available:
    if (
      booking.booking_options.meal_service &&
      !flight.flight_info.sells_food
    ) {
      return Response.json(
        {
          ok: false,
          message: 'Impossible booking option submitted.',
        },
        {
          status: 400,
        }
      );
    }

    // Check if the passengers are within range:
    if (
      booking.person_options.length == 0 ||
      booking.person_options.length > MAX_PASSENGERS
    ) {
      return Response.json(
        {
          ok: false,
          message: 'Impossible booking option submitted.',
        },
        {
          status: 400,
        }
      );
    }

    // Seat(s) is/are available:
    let seatIsNotAvailable = false;
    for (let person of booking.person_options) {
      let seat = person.seat;

      const isTaken = await getSeatIsTaken(seat, flight.flight_id);
      if (isTaken) {
        seatIsNotAvailable = true;
        break;
      }
    }

    if (seatIsNotAvailable) {
      return Response.json(
        {
          ok: false,
          message: 'Impossible booking option submitted.',
        },
        {
          status: 400,
        }
      );
    }

    // Flight has not departed
    const flightDeparted =
      new Date() > new Date(flight.flight_info.departure_date);

    if (flightDeparted) {
      return Response.json(
        {
          ok: false,
          message: 'Impossible booking option submitted.',
        },
        {
          status: 400,
        }
      );
    }

    // Give the booking a unique ID:
    booking.booking_id = await generateBookingId(account.user_id);

    let cost = calculateCost({
      flight: flight,
      airplane: airplane,
      personPreferences: booking.person_options,
      essentialOptions: booking.booking_options,
    });

    let transactionMetadata: TransactionMetadata;
    if (isBundle) {
      transactionMetadata = {
        isBundle: true,
        bundleType: bundleType,
      };
    } else {
      transactionMetadata = {};
    }

    let bookingSchemaSend = await createTransactionLog(
      booking as BookingSubmission & { booking_id: string },
      'booking',
      cost,
      transactionMetadata
    );

    // Save the booking
    let doc = await new Bookings(bookingSchemaSend).save();

    if (!doc) {
      return Response.json(
        {
          ok: false,
          message: 'Encountered unexpected error in submission.',
        },
        {
          status: 500,
        }
      );
    }

    await sendInboxMessage(account.user_id, {
      author: 'system',
      message_id: await generateMessageId(0, account.user_id),
      timestamp: new Date().getTime(),
      unread: true,
      message: {
        title: `Receipt ID: ${bookingSchemaSend.booking_id} • You have made a booking! • Flight ID: ${flight.flight_id}`,
        contents: createNiceMessageForInbox(bookingSchemaSend, flight),
      },
    });
  } catch {
    return Response.json(
      {
        ok: false,
        message: 'Encountered unexpected error in submission.',
      },
      {
        status: 500,
      }
    );
  }
  return Response.json(
    {
      ok: true,
      message: 'Successfully made booking.',
    },
    {
      status: 200,
    }
  );
}
