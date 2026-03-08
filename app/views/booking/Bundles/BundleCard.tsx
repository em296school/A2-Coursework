import {
  BookingPreferencesOptions,
  BookingProps,
  BundleTypes,
} from '@/app/models/Bookings';
import { AwardIcon } from '../../icons/AwardIcon';
import { getBundlePreset } from '@/app/helpers/getBundlePreset';
import { GiftIcon } from '../../icons/GiftIcon';
import { ChevronsRightIcon } from '../../icons/ChevronsRightIcon';
import { FlightProps } from '@/app/models/Flights';
import { doesFlightHaveMealService } from '@/app/helpers/doesFlightHaveMealService';
import { AirplaneProps, SeatGroupType } from '@/app/models/Airplanes';
import { doesAirplaneHaveSeatGroup } from '@/app/helpers/doesAirplaneHaveSeatGroup';
import { Tooltip } from '@mantine/core';
import { getFirstSeatAvailableInSeatGroup } from '@/app/helpers/getSeats';
import { getAdditionalCost } from '@/app/helpers/getAdditionalCost';
import { DeniedIcon } from '../../icons/DeniedIcon';

export interface BundleCardProps {
  isBestSeller: boolean;
  basePrice: number;
  title: React.ReactElement;
  bundleType: BundleTypes;
  flight: FlightProps;
  airplane: AirplaneProps;
  bookings: BookingProps[];
  disabled?: boolean;
  onClick: (name: BundleTypes) => void;
}

export interface CardProps {
  basePrice: number;
  isBestSeller: (name: string) => boolean;
  flight: FlightProps;
  airplane: AirplaneProps;
  bookings: BookingProps[];
  disabled?: boolean;
  onClick: (name: BundleTypes) => void;
}

export default function BundleCard({
  isBestSeller,
  basePrice,
  title,
  flight,
  airplane,
  bookings,
  bundleType,
  disabled,
  onClick,
}: BundleCardProps) {
  if (disabled) {
    return (
      <div className="w-full h-110 rounded-2xl shadow-lg border-2 border-gray-200 py-10 px-3">
        <button className="w-full h-full flex flex-col justify-start">
          <div className="h-35">
            <div className="flex flex-row justify-center items-center gap-2">
              <DeniedIcon size={30} strokeWidth={2} opacity={0.5} />
              <h2 className="flex justify-center items-center h-12 text-black/50 text-2xl font-medium">
                {title}
              </h2>
            </div>
            <h2 className="font-medium text-black/50">
              is not available for this flight
            </h2>
          </div>
        </button>
      </div>
    );
  }

  // We know the bundle is enabled so we can continue with more
  // performance costly actions
  let preferences = getBundlePreset(bundleType);

  // Format the options to be displayed in the bundle card
  // and calculate any additional costs.
  let price: number | null = basePrice;
  let formattedPreferences = preferences.map((includes) => {
    if (includes.OPTION[1] == false) return {};
    let isOffered = true;

    if (includes.OPTION[0] == 'meal_service') {
      isOffered = doesFlightHaveMealService(flight);
    } else if (includes.OPTION[0] == 'seat_group') {
      let seatGroup = includes.OPTION[1] as SeatGroupType;
      isOffered = getFirstSeatAvailableInSeatGroup(
        flight,
        airplane,
        bookings,
        seatGroup
      )
        ? true
        : false;
    }

    // Add the cost
    try {
      if (price != null && isOffered) {
        let value = includes.OPTION[1];
        price += getAdditionalCost(
          includes.OPTION[0],
          (typeof value == 'string' && value) || undefined
        );
      }
    } catch (err: Error | any) {
      price = null;
    }

    return {
      text: includes.TEXT,
      available: isOffered,
    };
  });
  return (
    <div className="group w-full h-110 rounded-2xl shadow-lg border-2 border-gray-200 py-10 px-3 hover:shadow-black/50 transition-all duration-200">
      <button
        onClick={() => onClick(bundleType)}
        className="w-full h-full flex flex-col justify-start"
      >
        <div className="h-35">
          <h2 className="flex justify-center items-center h-12 text-black text-2xl font-medium">
            {title}
          </h2>
          <h2 className="text-3xl text-gg-green">
            {(price && `£${price.toFixed(2)}`) || "Couldn't find price"}
          </h2>
          {isBestSeller ? (
            <h2 className="flex flex-row gap-1 justify-center items-center text-amber-600 text-md font-medium">
              <AwardIcon size={15} strokeWidth={2} />
              Best seller
            </h2>
          ) : (
            <></>
          )}
        </div>
        <div className="w-full h-40 mt-4">
          {formattedPreferences.map((value, index) => {
            let isGray = index % 2 == 0;
            return (
              <div
                key={index}
                className="flex flex-row items-center gap-2 px-5 py-0.5 text-black/50"
                style={{
                  backgroundColor: (isGray && '#eeeeee') || 'white',
                }}
              >
                <GiftIcon size={13} strokeWidth={2} />
                {value.available ? (
                  value.text
                ) : (
                  <Tooltip label="Not available on this flight" withArrow>
                    <span className="line-through text-black/30">
                      {value.text}
                    </span>
                  </Tooltip>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-center items-end h-30 w-full">
          <div className="flex flex-row gap-2 items-center text-black/50">
            <ChevronsRightIcon
              className="group-hover:rotate-180 duration-200"
              size={15}
              strokeWidth={2}
            />
            <span className="group-hover:underline">
              Select this bundle for myself
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
