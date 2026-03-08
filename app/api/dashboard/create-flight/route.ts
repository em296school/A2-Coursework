import Validator from '@/app/controllers/Validator/Validator';
import { AirplaneProps, Airplanes } from '@/app/models/Airplanes';
import { Flights } from '@/app/models/Flights';
import { FlightCreationProps } from '@/app/types/Flights.types';
import { connectDB } from '@/lib/mongoose';
import { signIntoAccountWithCookie } from '@/lib/userAccount';

export async function POST(request: Request) {
  await connectDB();

  const flight: FlightCreationProps = await request.json();
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

  const validator = new Validator(flight);
  if (!validator.validateFlightCreation()) {
    return Response.json(
      {
        ok: false,
        message: 'Creation cannot be validated.',
      },
      {
        status: 400,
      }
    );
  }

  try {
    // Check the airplane exists
    const airplaneDoc: AirplaneProps | undefined = await Airplanes.findOne({
      name: flight.airplane,
    }).exec();

    if (!airplaneDoc) {
      return Response.json(
        {
          ok: false,
          message: 'Creation cannot be validated.',
        },
        {
          status: 400,
        }
      );
    }

    // Create the flight
    const totalFlights = await Flights.countDocuments().exec();
    const flightDoc = await new Flights({
      airplane_id: airplaneDoc.airplane_id,
      flight_id: `${totalFlights + 1}-${new Date().getTime()}-${account.user_id}-${airplaneDoc.airplane_id}`,
      staff_id: account.user_id,

      flight_info: {
        arrival_location: flight.arrival_location,
        departure_location: flight.departure_location,
        departure_date: new Date(flight.departure_date),
        base_price: Number(flight.base_price),
        sells_food: flight.sells_food,
      },
    }).save();

    if (!flightDoc) {
      return Response.json(
        {
          ok: false,
          message: 'Error creating flight.',
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        ok: true,
        message: 'Successfully created flight.',
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
    return Response.json(
      {
        ok: false,
        message: 'Unexpected error encountered.',
      },
      {
        status: 500,
      }
    );
  }
}
