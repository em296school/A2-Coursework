import Validator from '@/app/controllers/Validator/Validator';
import { Flights } from '@/app/models/Flights';
import { connectDB } from '@/lib/mongoose';
import { signIntoAccountWithCookie } from '@/lib/userAccount';

export async function POST(request: Request) {
  await connectDB();

  const filterOptions = await request.json();
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

  const validator = new Validator(filterOptions);
  if (!validator.validateFlightFilterOptions()) {
    return Response.json(
      {
        ok: false,
        message: 'Filter options are malformed.',
      },
      {
        status: 400,
      }
    );
  }

  // Deconstruct to, from & any from the filter options
  let { to, from, any } = filterOptions as Record<string, string[]>;

  // Merge any into to & from
  to = to.concat(any);
  from = from.concat(any);

  // With this we can only pass in to & from to their unique
  // fields without needing to manually pass any
  const query = {
    $or: [
      { 'flight_info.departure_location': { $in: from } }, // any string in from
      { 'flight_info.arrival_location': { $in: to } }, // any string in to
    ],
  };

  try {
    let flights = await Flights.find(query).lean().exec();

    if (!flights) {
      return Response.json(
        {
          ok: false,
          message: "Couldn't get flights at this time.",
        },
        {
          status: 500,
        }
      );
    }

    // Clean it up
    flights = flights.map((flight) => {
      delete flight._id;
      return flight;
    });

    // Send it back
    return Response.json(flights, {
      status: 200,
    });
  } catch {
    return Response.json(
      {
        ok: false,
        message: "Couldn't get flights at this time.",
      },
      {
        status: 500,
      }
    );
  }
}
