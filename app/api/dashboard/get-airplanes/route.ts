import Validator from '@/app/controllers/Validator/Validator';
import { AirplaneProps, Airplanes } from '@/app/models/Airplanes';
import { Flights } from '@/app/models/Flights';
import { connectDB } from '@/lib/mongoose';
import { signIntoAccountWithCookie } from '@/lib/userAccount';

export async function GET(request: Request) {
  await connectDB();

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

  try {
    // Get the airplanes from the database and return
    let airplanes: AirplaneProps[] = await Airplanes.find().lean().exec();

    if (!airplanes) {
      return Response.json(
        {
          ok: false,
          message: 'Could not fetch airplanes at this time.',
        },
        {
          status: 500,
        }
      );
    }

    // Clean up
    airplanes = airplanes.map((airplane) => {
      delete airplane._id;
      return airplane;
    });

    return Response.json(airplanes, {
      status: 200,
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
}
