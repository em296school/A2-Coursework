'use client';
import { AirplaneProps } from '@/app/models/Airplanes';
import { FlightProps } from '@/app/models/Flights';
import { PreferencesAirplaneSeating } from './PreferencesAirplaneSeating';
import { PreferencesSubtotal } from './PreferencesSubtotal';
import {
  EssentialOptionsProps,
  PreferencesEssentialOptions,
} from './PreferencesEssentialOptions';
import { PreferencesAdditionalOptions } from './PreferencesAdditionalOptions';
import { BookingPreferencesOptions, BookingProps } from '@/app/models/Bookings';
import { useState } from 'react';
import { AccountProps } from '@/app/models/Accounts';
import Selector from './PersonPreference/Selector';
import { getBookingFromSelection } from '@/app/helpers/getBooking';
import { useRouter } from 'next/navigation';

export interface PreferencesMenuProps {
  flight: FlightProps;
  airplane: AirplaneProps;
  bookings: BookingProps[];
  account: AccountProps;
}

export interface PersonOptionsProps {
  _id?: Object;
  first_name: string;
  last_name: string;
  seat: string;
  requires_assistance: boolean;
  wheelchair: boolean;
  key?: number;
}

export function PreferencesMenu(props: PreferencesMenuProps) {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [personPreferences, setPersonPreferences] = useState<
    PersonOptionsProps[]
  >([]);
  const [essentialOptions, setEssentialOptions] =
    useState<EssentialOptionsProps>({
      early_boarding: false,
      meal_service: false,
      extra_luggage: false,
    });

  function canSubmitForm(): boolean {
    if (personPreferences.length == 0) {
      setErrorMessage('You need at least one passenger to make a booking.');
      return false;
    }

    // Make sure all people have an assigned seat
    let canSubmit = true;
    for (let passenger of personPreferences) {
      if (passenger.seat == '') {
        setErrorMessage('All passengers require a seat.');
        canSubmit = false;
        break;
      }
    }
    return canSubmit;
  }

  function submitForm() {
    if (!canSubmitForm()) return;
    setErrorMessage('');

    let booking = getBookingFromSelection(
      props.account,
      props.bookings,
      props.flight,
      personPreferences,
      essentialOptions
    );
    let data = encodeURIComponent(JSON.stringify(booking));
    router.push('/pay?data=' + data);
  }

  return (
    <>
      <PreferencesSubtotal
        personPreferences={personPreferences}
        essentialOptions={essentialOptions}
        flight={props.flight}
        airplane={props.airplane}
      />
      <div className="flex flex-row gap-4 w-full h-full">
        <PreferencesAirplaneSeating
          airplane={props.airplane}
          bookings={props.bookings}
          passengers={personPreferences}
          setPassengers={setPersonPreferences}
        />
        <div className="flex flex-col gap-4 w-[60%] h-fit">
          <PreferencesEssentialOptions
            sellsFood={props.flight.flight_info.sells_food ? true : false}
            essentialOptions={essentialOptions}
            setEssentialOptions={setEssentialOptions}
          />
          <PreferencesAdditionalOptions
            personPreferences={personPreferences}
            setPersonPreferences={setPersonPreferences}
            account={props.account}
          />
          <div className="flex flex-row gap-8 items-center">
            <button
              onClick={submitForm}
              className="flex justify-center items-center bg-black/40 text-white text-xl py-2.5 px-8 shadow-lg rounded-xl hover:bg-gg-green hover:mb-0.5 transition-all duration-150"
            >
              <h2 className="font-semibold">Continue to Pay</h2>
            </button>
            <a
              href="/"
              rel="noreferrer"
              className="text-[16px] text-black/50 font-medium hover:text-black"
            >
              Go back to flights
            </a>
          </div>
          <Selector.Error>{errorMessage}</Selector.Error>
        </div>
      </div>
    </>
  );
}
