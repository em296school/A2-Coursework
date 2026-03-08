import { BookingPreferencesOptions } from '@/app/models/Bookings';
import { Dispatch, SetStateAction, useState } from 'react';
import { ConfigIcon } from '../icons/ConfigIcon';
import Selector from './PersonPreference/Selector';

import { COSTS } from '@/app/consts/Bundles.json';

export type EssentialOptionsProps = Omit<
  BookingPreferencesOptions,
  'seat_group'
>;
export function PreferencesEssentialOptions({
  essentialOptions,
  setEssentialOptions,
  sellsFood,
}: {
  essentialOptions: EssentialOptionsProps;
  setEssentialOptions: Dispatch<SetStateAction<EssentialOptionsProps>>;
  sellsFood: boolean;
}) {
  function setOption(option: string) {
    return function (checked: boolean) {
      setEssentialOptions((prev) => ({
        ...prev,
        [option]: checked,
      }));
    };
  }
  return (
    <div className="flex flex-col gap-1 w-full h-fit rounded-2xl shadow-lg border-2 border-gray-200 px-3 pt-4 pb-7">
      <h2 className="flex flex-row gap-2 font-semibold text-2xl text-black/70 items-center">
        <ConfigIcon size={30} strokeWidth={2} />
        Essential Options
      </h2>
      <h2 className="text-black/50">
        Select additional options to accompany you on your flight.
      </h2>
      <Selector>
        <div className="relative h-3 w-full mt-2">
          <div className="absolute inset-0 flex items-center">
            <div className="h-px w-full bg-black/40 z-0" />
          </div>
          <div className="absolute inset-0 flex justify-center items-center w-full h-full">
            <h2 className="flex flex-row gap-2 justify-center items-center text-sm font-semibold text-black/40 bg-white w-fit px-4">
              ON-FLIGHT ADDITIONS
            </h2>
          </div>
        </div>
        <div className="flex flex-row gap-2 mt-2 bg-black/5 p-2 rounded-lg">
          <Selector.BooleanOption onChange={setOption('extra_luggage')}>
            <div className="flex flex-col gap-1">
              <h2 className="text-black font-medium text-md">Extra lugggage</h2>
              <h2 className="text-xs">
                Extra lugggage on flight. (+
                <span className="text-gg-green">
                  £{COSTS.extra_luggage.toFixed(2)}
                </span>
                )
              </h2>
            </div>
          </Selector.BooleanOption>
          <Selector.BooleanOption
            onChange={setOption('meal_service')}
            disabled={!sellsFood}
          >
            <div className="flex flex-col gap-1">
              <h2
                className={` font-medium text-md ${!sellsFood ? 'line-through text-black/50' : 'text-black'}`}
              >
                Meal service
              </h2>
              <h2 className="text-xs">
                Food provided on flight. (+
                <span className="text-gg-green">
                  £{COSTS.meal_service.toFixed(2)}
                </span>
                )
              </h2>
            </div>
          </Selector.BooleanOption>
        </div>
        <div className="relative h-3 w-full">
          <div className="absolute inset-0 flex items-center">
            <div className="h-px w-full bg-black/40 z-0" />
          </div>
          <div className="absolute inset-0 flex justify-center items-center w-full h-full">
            <h2 className="flex flex-row gap-2 justify-center items-center text-sm font-semibold text-black/40 bg-white w-fit px-4">
              PRE-FLIGHT ADDITIONS
            </h2>
          </div>
        </div>
        <div className="flex flex-row gap-2 p-2 rounded-lg">
          <Selector.BooleanOption onChange={setOption('early_boarding')}>
            <div className="flex flex-col gap-1">
              <h2 className="text-black font-medium text-md">Early boarding</h2>
              <h2 className="text-xs">
                Priority boarding to flight. (+
                <span className="text-gg-green">
                  £{COSTS.early_boarding.toFixed(2)}
                </span>
                )
              </h2>
            </div>
          </Selector.BooleanOption>
        </div>
      </Selector>
    </div>
  );
}
