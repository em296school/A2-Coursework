import { NextURLSearchParams } from '@/app/types/URLs.types';
import { FlightProps, Flights } from '@/app/models/Flights';
import { AirplaneProps, Airplanes } from '@/app/models/Airplanes';
import { BookingOption } from '@/app/types/Flights.types';
import BookingTimeSelectMenu from './BookingTimeSelectMenu';
import { HistoryIcon } from '../icons/HistoryIcon';
import BookingBundleMenu from './BookingBundleMenu';
import NoFlightAvailable from '../NoFlightAvailable';
import { BookingProps, Bookings } from '@/app/models/Bookings';

export default async function BookingDisplay({
  searchParams,
}: {
  searchParams: NextURLSearchParams;
}) {
  // Get the search options so we can display all the flights
  // **THAT DAY**
  const { date, departure, arrival, id } = await searchParams;

  // If it has an idea we have selected a flight:
  if (id && typeof id == 'string') {
    return <BookingBundleMenu id={id} />;
  }
  let flights;

  // Get all flights which meet the departure & arrival
  try {
    flights = await Flights.find({
      'flight_info.departure_location': departure,
      'flight_info.arrival_location': arrival,
    })
      .lean()
      .exec();

    if (!flights || (flights && flights.length === 0)) {
      return <NoFlightAvailable />;
    }
  } catch (err) {
    return <NoFlightAvailable />;
  }

  // Now filter all these based on the same day
  let departureDate = new Date(Number(date));
  let day = departureDate.toDateString();
  flights = Object.values(flights).filter((flight: FlightProps) => {
    return flight.flight_info.departure_date.toDateString() == day;
  });

  let cheapestOption = {
    price: 0,
    key: 0,
  };

  function setCheapest(index: number, price: number) {
    cheapestOption.key = index;
    cheapestOption.price = price;
  }

  // Remove the _id: Object from the flights to allow them to be
  // passed to the client menu
  flights = await Promise.all(
    flights.map(async (flight: FlightProps & { _id?: Object }, index) => {
      delete flight._id;

      const airplane: AirplaneProps = await Airplanes.findOne({
        airplane_id: flight.airplane_id,
      }).exec();

      const bookableFlight: BookingOption = {
        ...flight,
        airplane_id: airplane.airplane_id,
        column_amount: airplane.column_amount,
        name: airplane.name,
      };

      // We also store the price so we can state whether it is the cheapest
      // or not later.
      if (cheapestOption.key == 0) {
        setCheapest(index, bookableFlight.flight_info.base_price);
      } else if (cheapestOption.price > bookableFlight.flight_info.base_price) {
        // It is the cheapest flight *so far*
        setCheapest(index, bookableFlight.flight_info.base_price);
      }

      return bookableFlight;
    })
  );

  // Find the one which has the cheapest price and set its 'isCheapest' prioperty to true:
  let cheapestIndex: number | null = null;
  let cheapestPrice = Infinity;

  flights.forEach((flight, index) => {
    const price = flight.flight_info.base_price;
    if (price < cheapestPrice) {
      cheapestPrice = price;
      cheapestIndex = index;
    }
  });

  if (cheapestIndex !== null) {
    flights[cheapestIndex].isCheapest = true;
  }

  // Now we can map it and display it to a table
  let displayedFlights: BookingOption[] = flights;

  // Get all the bookings for SoldSeats
  let bookings: BookingProps[] = await Bookings.find().lean().exec();
  bookings = bookings.map((booking) => {
    delete booking._id;
    booking.person_options.map((person) => {
      delete person._id;
      return person;
    });

    return booking;
  });

  return (
    <div className="top-0 absolute h-screen w-screen">
      <div className="flex flex-row justify-center items-center h-screen">
        <div className="flex flex-col gap-8 justify-start items-center p-12 h-fit w-250 rounded-2xl shadow-xl">
          <div className="flex flex-row items-center gap-4 w-full">
            <HistoryIcon size={40} strokeWidth={2.5} />
            <div className="flex flex-col gap-2">
              <h2 className="font-semibold text-4xl">
                Select your flight time
              </h2>
              <h2 className="font-normal text-xl text-black/50">
                Use the arrows to view more available flights
              </h2>
            </div>
          </div>
          <BookingTimeSelectMenu
            departureLocation={departure as string}
            arrivalLocation={arrival as string}
            date={departureDate}
            bookings={bookings}
          >
            {displayedFlights}
          </BookingTimeSelectMenu>
        </div>
      </div>
    </div>
  );
}
