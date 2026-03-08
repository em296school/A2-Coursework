import Validator from '@/app/controllers/Validator/Validator';
import { Flights } from '@/app/models/Flights';
import { FlightEdits } from '@/app/types/Flights.types';
import { connectDB } from '@/lib/mongoose';
import { signIntoAccountWithCookie } from '@/lib/userAccount';

export async function POST(request: Request) {
  await connectDB();

  const edits: FlightEdits = await request.json();
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

  const validator = new Validator(edits);
  if (!validator.validateFlightEdits()) {
    return Response.json(
      {
        ok: false,
        message: 'Edits are malformed.',
      },
      {
        status: 400,
      }
    );
  }

  // Deconstruct the edits for easier access
  let { flightId, basePrice } = edits;

  // Try find the flight and if so, apply the
  // changes
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

    // Apply edits
    const updateQuery: Record<string, any> = {};
    if (basePrice) {
      updateQuery['flight_info.base_price'] = basePrice;
    }

    const success = await Flights.updateOne(
      {
        flight_id: flightId,
        'flight_info.base_price': { $ne: basePrice },
      },
      updateQuery
    ).exec();

    if (!success) {
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
      message: 'Successfully modified flight.',
    },
    {
      status: 200,
    }
  );
}
