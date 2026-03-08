import { FlightProps, Flights } from '@/app/models/Flights';
import { AirplaneProps, Airplanes } from '@/app/models/Airplanes';
import { BookingOption } from '@/app/types/Flights.types';
import { ConfigIcon } from '../icons/ConfigIcon';
import { RightArrowIcon } from '../icons/RightArrowIcon';
import { HistoryIcon } from '../icons/HistoryIcon';
import { dateToShortString } from '@/app/helpers/dateToShortString';
import { getTimeAsAMPM } from '@/app/helpers/getTimeAsAMPM';
import PremiumPlus from './Bundles/PremiumPlus';
import { Transactions } from '@/app/models/Transactions';

import Bundles from '@/app/consts/Bundles.json';
import Premium from './Bundles/Premium';
import Basic from './Bundles/Basic';
import {
  BookingPreferencesOptions,
  BookingProps,
  Bookings,
  BundleTypes,
  UnevaluatedPreferences,
} from '@/app/models/Bookings';
import BundlesMenu from './BundlesMenu';
import { ChevronsRightIcon } from '../icons/ChevronsRightIcon';
import NoFlightAvailable from '../NoFlightAvailable';
import { signIntoAccountWithCookie } from '@/lib/userAccount';
import NotSignedIn from '../preferences/NotSignedIn';

async function calculateBestSeller(flightId: string): Promise<string> {
  let premiumPlusCount = [
    Bundles.PREMIUM_PLUS.NAME,
    await Transactions.countDocuments({
      ['metadata.bundleType']: Bundles.PREMIUM_PLUS.NAME,
      ['flight_id']: flightId,
      type: 'booking',
    }).exec(),
  ];
  let premiumCount = [
    Bundles.PREMIUM.NAME,
    await Transactions.countDocuments({
      ['metadata.bundleType']: Bundles.PREMIUM.NAME,
      ['flight_id']: flightId,
      type: 'booking',
    }).exec(),
  ];
  let basicCount = [
    Bundles.BASIC.NAME,
    await Transactions.countDocuments({
      ['metadata.bundleType']: Bundles.BASIC.NAME,
      ['flight_id']: flightId,
      type: 'booking',
    }).exec(),
  ];

  let options = [premiumPlusCount, premiumCount, basicCount];

  // Check if they are all the same (or there is no transactions at all):
  // to prevent misleading 'best seller' tag on cards
  let countPremiumPlus = premiumPlusCount[1] as number;
  let countPremium = premiumCount[1] as number;
  let countBasic = basicCount[1] as number;

  if (countPremiumPlus == countPremium && countPremiumPlus == countBasic) {
    return '';
  }

  // Sort and return the first element's zero index
  options.sort((a, b) => {
    return a[1] < b[1] ? 1 : -1;
  });

  // Check if two of the top sellers are the **same**
  // and if so return none because neither are best sellers
  if (options[0][1] == options[1][1]) {
    return '';
  }

  return options[0][0] as string;
}

export default async function BookingBundleMenu({ id }: { id: string }) {
  let account = await signIntoAccountWithCookie();

  if (!account) {
    return <NotSignedIn />;
  }

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
  delete account._id;

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

  let bestSeller: string;

  try {
    bestSeller = await calculateBestSeller(flight.flight_id);
  } catch {
    bestSeller = '';
  }

  const bookableFlight: BookingOption = {
    ...flight,
    airplane_id: airplane.airplane_id,
    column_amount: airplane.column_amount,
    name: airplane.name,
  };

  // Get all the bookings for this flight
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

  return (
    <div className="top-0 absolute h-screen w-screen">
      <div className="flex flex-row justify-center items-center h-screen">
        <div className="flex flex-col gap-8 justify-start items-center p-12 h-fit w-250 rounded-2xl shadow-xl">
          <div className="flex flex-row items-center gap-4 w-full">
            <ConfigIcon size={40} strokeWidth={2.5} />
            <div className="flex flex-col gap-2">
              <h2 className="font-semibold text-4xl">
                Select your preferences
              </h2>
              <h2 className="font-normal text-xl text-black/50">
                Select a flight package or customise your options
              </h2>
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full h-27 rounded-2xl shadow-lg border-2 border-gray-200 p-3">
            <h2 className="flex flex-row gap-3 text-[25px] font-semibold items-center">
              <span>{bookableFlight.flight_info.departure_location}</span>
              <RightArrowIcon size={37} />
              <span>{bookableFlight.flight_info.arrival_location}</span>
              <span className="ml-3 text-black/70 text-lg font-normal w-120">
                {airplane.name}
              </span>
              <div className="flex justify-end w-full">
                <a
                  href="/"
                  rel="noreferrer"
                  className="text-[16px] text-black/50 font-medium pr-3 mb-3 hover:text-black"
                >
                  Go back to flights
                </a>
              </div>
            </h2>
            <h2 className="flex flex-row gap-1 text-lg font-normal text-black/60 items-center">
              <HistoryIcon size={20} strokeWidth={2} />
              {dateToShortString(flight.flight_info.departure_date)},{' '}
              {getTimeAsAMPM(flight.flight_info.departure_date)}
            </h2>
          </div>
          <BundlesMenu
            bestSeller={bestSeller}
            flight={flight}
            airplane={airplane}
            bookings={bookings}
            account={account}
            id={id}
          />
        </div>
      </div>
    </div>
  );
}
