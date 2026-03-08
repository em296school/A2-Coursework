import Validator from '@/app/controllers/Validator/Validator';
import { calculateCost } from '@/app/helpers/calculateCost';
import { AirplaneProps, Airplanes } from '@/app/models/Airplanes';
import { Bookings, BookingSubmission } from '@/app/models/Bookings';
import { FlightProps, Flights } from '@/app/models/Flights';
import { Ratings } from '@/app/models/Ratings';
import { TransactionMetadata } from '@/app/models/Transactions';
import { connectDB } from '@/lib/mongoose';
import { createTransactionLog } from '@/lib/transactions';
import { signIntoAccountWithCookie } from '@/lib/userAccount';
import { Rating } from '@mantine/core';

export async function POST(request: Request) {
  await connectDB();

  const { flightId, stars } = await request.json();
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

  // Validate message & flightId:
  try {
    const validator = new Validator(stars);
    if (!validator.validateStarRating()) {
      return Response.json(
        {
          ok: false,
          message: 'Invalid star rating.',
        },
        {
          status: 400,
        }
      );
    }

    const flight = await Flights.findOne({
      flight_id: flightId,
    }).exec();
    if (!flight) {
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

    // Check if this user has already made a rating for this
    // flight
    let alreadyRated = await Ratings.findOne({
      user_id: account.user_id,
      'rating.flight_id': flightId,
    }).exec();

    if (alreadyRated) {
      return Response.json(
        {
          ok: false,
          message: 'You have already rated this flight.',
        },
        {
          status: 400,
        }
      );
    }

    // Get the ratingId
    let ratingId = account.user_id.toString();
    const ratingsAmount = await Ratings.countDocuments().exec();

    ratingId = ratingId + ratingsAmount.toString();

    // Save the star rating
    await new Ratings({
      user_id: account.user_id,
      rating_id: ratingId,

      rating: {
        flight_id: flightId,
        stars: stars,
      },
    }).save();
  } catch {
    return Response.json(
      {
        ok: false,
        message: 'Unexpected server error.',
      },
      {
        status: 500,
      }
    );
  }

  return Response.json(
    {
      ok: true,
      message: 'Successfully rated flight experience.',
    },
    {
      status: 200,
    }
  );
}
