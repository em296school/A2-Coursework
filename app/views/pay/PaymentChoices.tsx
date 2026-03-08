import { AirplaneProps } from '@/app/models/Airplanes';
import { FlightProps } from '@/app/models/Flights';
import { PersonOptionsProps } from '../preferences/PreferencesMenu';
import { EssentialOptionsProps } from '../preferences/PreferencesEssentialOptions';
import { ShoppingCartIcon } from '../icons/ShoppingCartIcon';
import {
  calculateCost,
  calculatePassengerCost,
} from '@/app/helpers/calculateCost';

import Bundles from '@/app/consts/Bundles.json';
import { LayersIcon } from '../icons/LayersIcon';
import { UserIcon } from '../icons/UserIcon';
import { formatToName } from '@/app/helpers/formatToName';
const Names: Record<string, string> = Bundles.NAMES;
const Costs: Record<string, number> = Bundles.COSTS;

export interface SubtotalProps {
  airplane: AirplaneProps;
  personPreferences: PersonOptionsProps[];
  essentialOptions: EssentialOptionsProps;
}

function Choice({
  isGrey,
  children,
}: {
  isGrey?: boolean;
  children: React.ReactElement[];
}) {
  return (
    <div
      className="flex p-2 gap-2 w-full h-10 text-lg font-normal text-black/70 items-center"
      style={{
        backgroundColor: isGrey ? '#eeeeee' : '#ffffff',
      }}
    >
      {children}
    </div>
  );
}

export function PaymentChoices(props: SubtotalProps) {
  let count = 0;

  let passengerCost = calculatePassengerCost({
    airplane: props.airplane,
    personPreferences: props.personPreferences,
  });

  return (
    <div className="flex flex-col gap-1 w-full h-fit">
      <div className="relative h-3 w-full">
        <div className="absolute inset-0 flex items-center">
          <div className="h-px w-full bg-black/20 z-0" />
        </div>
        <div className="absolute inset-0 flex justify-center items-center w-full h-full">
          <h2 className="flex justify-center text-sm font-semibold text-black/20 bg-white w-fit px-4 mr-40">
            BOARDING OPTIONS
          </h2>
        </div>
      </div>
      {Object.entries(props.essentialOptions).map(([value, bool]) => {
        count++;
        if (!bool) return <div key={count}></div>;

        let isGrey = count % 2 == 0;
        let name = Names[value] || 'Unknown option';
        let cost = Costs[value] || false;

        return (
          <Choice key={count} isGrey={isGrey}>
            <LayersIcon size={15} strokeWidth={2} />
            <h2>{name}</h2>
            {cost ? (
              <h2 className="text-gg-green">+£{cost.toFixed(2)}</h2>
            ) : (
              <></>
            )}
          </Choice>
        );
      })}
      <div className="relative h-3 w-full mb-4 mt-2">
        <div className="absolute inset-0 flex items-center">
          <div className="h-px w-full bg-black/20 z-0" />
        </div>
        <div className="absolute inset-0 flex justify-center items-center w-full h-full">
          <h2 className="flex justify-center text-sm font-semibold text-black/20 bg-white w-fit px-4 mr-40">
            PASSENGER OPTIONS
          </h2>
        </div>
      </div>
      {props.personPreferences.map((value) => {
        count++;

        let isGrey = count % 2 == 0;

        return (
          <Choice key={count} isGrey={isGrey}>
            <UserIcon size={15} strokeWidth={2} />
            <span className="flex flex-row gap-1">
              {formatToName(value.first_name)}{' '}
              <h2 className="font-semimedium">
                {value.last_name.toUpperCase()}
              </h2>
              <h2 className="ml-2 text-black/30">
                ({value.seat.toUpperCase()})
              </h2>
            </span>
          </Choice>
        );
      })}
      <div className="relative h-3 w-[50%] ml-2">
        <div className="h-px w-full bg-black/20" />
        <h2 className="text-gg-green">+£{passengerCost.toFixed(2)}</h2>
      </div>
    </div>
  );
}
