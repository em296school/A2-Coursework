import { AirplaneProps, SeatGroupType } from '../models/Airplanes';

export function doesAirplaneHaveSeatGroup(
  airplane: AirplaneProps,
  seatGroup: SeatGroupType
): boolean {
  let found = airplane.seat_groups?.find((value) => {
    return value.name == seatGroup;
  });

  return found ? true : false;
}
