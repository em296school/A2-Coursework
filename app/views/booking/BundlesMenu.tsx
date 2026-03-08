'use client';

import {
  BookingProps,
  BookingSubmission,
  BundleTypes,
  UnevaluatedPreferences,
} from '@/app/models/Bookings';
import Basic from './Bundles/Basic';
import Premium from './Bundles/Premium';
import PremiumPlus from './Bundles/PremiumPlus';
import { FlightProps } from '@/app/models/Flights';
import { getBundlePreferences } from '@/app/helpers/getBundlePreferences';
import { getBundlePreset } from '@/app/helpers/getBundlePreset';
import { AirplaneProps } from '@/app/models/Airplanes';
import { ChevronsRightIcon } from '../icons/ChevronsRightIcon';
import { useRouter } from 'next/navigation';
import { getBookingFromBundle } from '@/app/helpers/getBooking';
import { AccountProps } from '@/app/models/Accounts';
import { getFirstSeatAvailableInSeatGroup } from '@/app/helpers/getSeats';

export interface BundlesMenuProps {
  bestSeller: string;
  account: AccountProps;
  airplane: AirplaneProps;
  flight: FlightProps;
  bookings: BookingProps[];
  id: string;
}

export default function BundlesMenu({
  bestSeller,
  account,
  flight,
  airplane,
  bookings,
  id,
}: BundlesMenuProps) {
  const router = useRouter();
  function continueWithPreset(name: BundleTypes) {
    let preferences = getBundlePreferences(getBundlePreset(name));

    let booking: BookingSubmission = getBookingFromBundle(
      account,
      flight,
      airplane,
      bookings,
      preferences
    );

    if (!flight.flight_info.sells_food) {
      booking.booking_options.meal_service = false;
    }

    booking.bundleType = name;
    let data = encodeURIComponent(JSON.stringify(booking));

    router.push('/pay?data=' + data);
  }

  function continueWithoutPreferences() {
    router.push(`/preferences?id=${id}`);
  }

  return (
    <>
      <div className="flex flex-row w-full gap-8">
        <PremiumPlus
          isBestSeller={(name: string) => {
            return name == bestSeller;
          }}
          basePrice={flight.flight_info.base_price}
          onClick={continueWithPreset}
          flight={flight}
          airplane={airplane}
          bookings={bookings}
          disabled={
            getFirstSeatAvailableInSeatGroup(
              flight,
              airplane,
              bookings,
              'business'
            )
              ? false
              : true
          }
        />
        <Premium
          isBestSeller={(name: string) => {
            return name == bestSeller;
          }}
          basePrice={flight.flight_info.base_price}
          onClick={continueWithPreset}
          flight={flight}
          airplane={airplane}
          bookings={bookings}
          disabled={
            getFirstSeatAvailableInSeatGroup(
              flight,
              airplane,
              bookings,
              'economy_plus'
            )
              ? false
              : true
          }
        />
        <Basic
          isBestSeller={(name: string) => {
            return name == bestSeller;
          }}
          basePrice={flight.flight_info.base_price}
          onClick={continueWithPreset}
          flight={flight}
          airplane={airplane}
          bookings={bookings}
          disabled={
            getFirstSeatAvailableInSeatGroup(
              flight,
              airplane,
              bookings,
              'economy'
            )
              ? false
              : true
          }
        />
      </div>
      <button
        onClick={continueWithoutPreferences}
        className="group w-full h-27 rounded-2xl shadow-lg border-2 border-gray-200 p-3 hover:shadow-black/50 duration-200"
      >
        <h2 className="flex justify-center items-center text-[25px] font-normal">
          <div className="flex flex-row gap-2 items-center text-black/50">
            <ChevronsRightIcon
              className="group-hover:rotate-180 duration-200"
              size={15}
              strokeWidth={2}
            />
            <span className="group-hover:underline">
              Select your own / family preferences
            </span>
          </div>
        </h2>
      </button>
    </>
  );
}
