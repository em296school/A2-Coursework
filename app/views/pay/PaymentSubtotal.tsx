import { AirplaneProps } from '@/app/models/Airplanes';
import { FlightProps } from '@/app/models/Flights';
import { PersonOptionsProps } from '../preferences/PreferencesMenu';
import { EssentialOptionsProps } from '../preferences/PreferencesEssentialOptions';
import { ShoppingCartIcon } from '../icons/ShoppingCartIcon';
import { calculateCost } from '@/app/helpers/calculateCost';

export interface SubtotalProps {
  flight: FlightProps;
  airplane: AirplaneProps;
  personPreferences: PersonOptionsProps[];
  essentialOptions: EssentialOptionsProps;
}

export function PaymentSubtotal(props: SubtotalProps) {
  return (
    <div className="flex flex-col gap-1 w-full h-27 rounded-2xl shadow-lg border-2 border-gray-200 py-4 px-6">
      <div className="flex-col">
        <div className="flex flex-row gap-2 items-center">
          <ShoppingCartIcon size={25} strokeWidth={2} />
          <h2 className="font-medium text-2xl">Subtotal</h2>
        </div>
        <h2 className="text-3xl font-medium text-gg-green">
          £
          {calculateCost({
            flight: props.flight,
            airplane: props.airplane,
            personPreferences: props.personPreferences,
            essentialOptions: props.essentialOptions,
          }).toFixed(2)}
        </h2>
      </div>
    </div>
  );
}
