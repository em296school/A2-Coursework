import { Accounts } from '@/app/models/Accounts';
import { BookingProps, Bookings } from '@/app/models/Bookings';
import { FlightProps, Flights } from '@/app/models/Flights';
import { connectDB } from '@/lib/mongoose';
import { signIntoAccountWithCookie } from '@/lib/userAccount';

export async function POST(request: Request) {
  await connectDB();

  const { userId }: { userId: number } = await request.json();
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

  if (!userId || (userId && typeof userId !== 'number')) {
    return Response.json(
      {
        ok: false,
        message: 'Could not find user.',
      },
      {
        status: 400,
      }
    );
  }

  // Validate the account exists, and if so return all the bookings
  // which have not yet passed
  try {
    const user = await Accounts.findOne({
      user_id: userId,
    }).exec();

    if (!user) {
      return Response.json(
        {
          ok: false,
          message: 'Could not find user.',
        },
        {
          status: 400,
        }
      );
    }

    // Now get all the bookings.
    const filter = {
      user_id: userId,
    };

    const bookings: BookingProps[] = await Bookings.find(filter).lean().exec();
    const upcomingBookings = [];

    for (let booking of bookings) {
      const flight: FlightProps = await Flights.findOne({
        flight_id: booking.flight_id,
      }).exec();

      if (flight && flight.flight_info.departure_date > new Date()) {
        delete booking._id;
        delete flight._id;

        for (let person of booking.person_options) {
          delete person._id;
        }

        const sendableBooking = {
          ...booking,
          ...flight,
          flight_info: {
            ...flight.flight_info,
          },
        };
        upcomingBookings.push(sendableBooking);
      }
    }

    return Response.json(upcomingBookings, {
      status: 200,
    });
  } catch {
    return Response.json(
      {
        ok: false,
        message: 'An unexpected error occurred.',
      },
      {
        status: 500,
      }
    );
  }
}
