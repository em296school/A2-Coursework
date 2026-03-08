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

  // Get the flight based on the ID
  let { flightId } = filterOptions;

  if (!flightId || (flightId && typeof flightId !== 'string')) {
    return Response.json(
      {
        ok: false,
        message: 'Invalid flight ID.',
      },
      {
        status: 400,
      }
    );
  }

  try {
    let flight = await Flights.findOne({
      flight_id: flightId,
    })
      .lean()
      .exec();

    if (!flight) {
      return Response.json(
        {
          ok: false,
          message: "Couldn't get flight at this time.",
        },
        {
          status: 500,
        }
      );
    }

    // Clean it up
    delete flight._id;

    // Send it back
    return Response.json(flight, {
      status: 200,
    });
  } catch {
    return Response.json(
      {
        ok: false,
        message: "Couldn't get flight at this time.",
      },
      {
        status: 500,
      }
    );
  }
}
