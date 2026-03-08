import {
  MINIMUM_FLIGHT_PRICE,
  MAXIMUM_FLIGHT_PRICE,
} from '@/app/consts/FlightSettings.json';

export default function ValidateFlightEdits(data: Record<string, any> | any) {
  if (!data || typeof data !== 'object') return false;

  // Check the price:
  if (data.basePrice) {
    if (Number.isNaN(Number(data.basePrice))) return false;
    const price = Number(data.basePrice);

    if (price < MINIMUM_FLIGHT_PRICE || price > MAXIMUM_FLIGHT_PRICE) {
      return false;
    }
  }

  return true;
}
