import { NextURLSearchParams } from '@/app/types/URLs.types';
import NoFlightAvailable from '../NoFlightAvailable';
import { FlightProps, Flights } from '@/app/models/Flights';
import { AirplaneProps, Airplanes } from '@/app/models/Airplanes';
import { PreferencesMenu } from './PreferencesMenu';
import { ListIcon } from '../icons/ListIcon';
import { BookingProps, Bookings } from '@/app/models/Bookings';
import { signIntoAccountWithCookie } from '@/lib/userAccount';
import NotSignedIn from './NotSignedIn';

export default async function PreferencesDisplay({
  searchParams,
}: {
  searchParams: NextURLSearchParams;
}) {
  const { id } = await searchParams;
  let flight: FlightProps & { _id?: Object };
  try {
    flight = await Flights.findOne({ flight_id: id }).lean().exec();

    if (!flight) {
      return <NoFlightAvailable />;
    }
  } catch {
    return <NoFlightAvailable />;
  }

  // Display the flight options now that we've found the flight:
  // Remove the _id as we can't pass an object through an element
  delete flight._id;

  // Get the airplane & the info for that
  let airplane: AirplaneProps & { _id?: Object } = await Airplanes.findOne({
    airplane_id: flight.airplane_id,
  })
    .lean()
    .exec();

  if (!airplane) {
    // Can't find the airplane info so presume it's invalid
    return <NoFlightAvailable />;
  }

  // Remove the id of the airplane too for the same
  // reason as above and strip the *seat_groups* too
  // as they have _ids in the Array
  delete airplane._id;

  if (airplane.seat_groups) {
    airplane.seat_groups.map((value) => {
      delete value._id;
      return value;
    });
  }

  const bookings: BookingProps[] = await Bookings.find({
    flight_id: flight.flight_id,
  })
    .lean()
    .exec();

  bookings.map((value) => {
    delete value._id;
    value.person_options.map((person) => {
      delete person._id;
      return person;
    });

    return value;
  });

  // Get the account (to allow people to 'Add myself' in
  // additional options)
  const account = await signIntoAccountWithCookie();
  if (!account) {
    return <NotSignedIn />;
  }

  delete account._id;

  return (
    <div className="mt-35 h-screen w-screen">
      <div className="flex flex-row justify-center items-center h-screen">
        <div className="flex flex-col gap-4 justify-start items-center p-12 h-fit w-250 rounded-2xl shadow-xl">
          <div className="flex flex-row items-center gap-4 w-full">
            <ListIcon size={40} strokeWidth={2.5} />
            <div className="flex flex-col gap-2">
              <h2 className="font-semibold text-4xl">
                Customise your preferences
              </h2>
              <h2 className="font-normal text-xl text-black/50">
                Use the menu to select your seating and flying optionsa
              </h2>
            </div>
          </div>
          <PreferencesMenu
            flight={flight}
            airplane={airplane}
            bookings={bookings}
            account={account}
          />
        </div>
      </div>
    </div>
  );
}
