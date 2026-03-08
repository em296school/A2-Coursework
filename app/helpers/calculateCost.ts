import { AirplaneProps } from '../models/Airplanes';
import { FlightProps } from '../models/Flights';
import { EssentialOptionsProps } from '../views/preferences/PreferencesEssentialOptions';
import { PersonOptionsProps } from '../views/preferences/PreferencesMenu';

import Bundles from '@/app/consts/Bundles.json';
import { createSeatRange } from './getSeats';

const costs: Record<string, number> = Bundles.COSTS;

export interface CostCalculationProps {
  flight: FlightProps;
  airplane: AirplaneProps;
  personPreferences: PersonOptionsProps[];
  essentialOptions: EssentialOptionsProps;
}

export function calculatePassengerCost({
  airplane,
  personPreferences,
}: {
  airplane: AirplaneProps;
  personPreferences: PersonOptionsProps[];
}) {
  let runningCost = 0;

  // Store the prices so we don't have to loop n times
  let seatRanges: Record<string, [string, string]> = {};

  if (airplane.seat_groups) {
    for (let seatGroup of Object.values(airplane.seat_groups)) {
      let name = seatGroup.name;
      let { row_start, row_end } = createSeatRange(
        seatGroup.row_start,
        seatGroup.row_end,
        airplane.column_amount
      );

      seatRanges[name] = [row_start, row_end];
    }

    for (let passenger of personPreferences) {
      if (passenger.seat == '') continue;

      // Get the seat group (if any)
      let group = '';

      for (let [targetGroup, targetRange] of Object.entries(seatRanges)) {
        if (
          passenger.seat >= targetRange[0] &&
          passenger.seat <= targetRange[1]
        ) {
          group = targetGroup;
          break;
        }
      }

      if (group !== '') {
        runningCost += costs[group];
      }
    }
  }

  return runningCost;
}

export function calculateCost({
  flight,
  airplane,
  personPreferences,
  essentialOptions,
}: CostCalculationProps) {
  // Get the base cost
  const basePrice = flight.flight_info.base_price;
  let runningCost = basePrice;

  // Calculate the essential options
  for (let [key, value] of Object.entries(essentialOptions)) {
    if (!value) continue;
    let cost = costs[key];

    runningCost += cost;
  }

  // Calculate the setting costs of where each
  // individual is seated.
  runningCost += calculatePassengerCost({
    airplane: airplane,
    personPreferences: personPreferences,
  });

  return runningCost;
}
