import { AirplaneProps, SeatGroupType } from '../models/Airplanes';
import { BookingProps, Bookings } from '../models/Bookings';
import { FlightProps } from '../models/Flights';
import { doesAirplaneHaveSeatGroup } from './doesAirplaneHaveSeatGroup';

function getSeatsAmount(
  rowA: string,
  rowB: string,
  columnAmount: number
): number {
  return (Math.abs(rowA.charCodeAt(0) - rowB.charCodeAt(0)) + 1) * columnAmount;
}

export function getSeatCapacity(airplane: AirplaneProps) {
  let columnAmount = airplane.column_amount;

  if (!airplane.seat_groups) {
    return 0;
  }

  let length = airplane.seat_groups.length - 1;
  let mapStart = airplane.seat_groups[0].row_start;
  let mapEnd = airplane.seat_groups[length].row_end;

  return getSeatsAmount(mapStart, mapEnd, columnAmount);
}

export function mapAllSeats(
  rowStart: string,
  rowEnd: string,
  columnAmount: number
) {
  const seats = [];
  for (
    let letter = rowStart.charCodeAt(0);
    letter <= rowEnd.charCodeAt(0);
    letter++
  ) {
    for (let col = 1; col <= columnAmount; col++) {
      seats.push(String.fromCharCode(letter) + col);
    }
  }
  return seats;
}

function findMissingSeats(
  rowStart: string,
  rowEnd: string,
  columnAmount: number,
  takenSeats: string[]
) {
  const allSeats = mapAllSeats(rowStart, rowEnd, columnAmount);
  const taken = new Set(takenSeats);
  return allSeats.filter((seat) => !taken.has(seat));
}

export function getTakenSeats(
  rowStart: string,
  rowEnd: string,
  bookings: BookingProps[]
) {
  let takenSeats = [];
  for (let booking of Object.values(bookings)) {
    for (let person of booking.person_options) {
      let seat = person.seat;
      if (seat >= rowStart && seat <= rowEnd) {
        takenSeats.push(seat);
      }
    }
  }

  return takenSeats;
}

export function createSeatRange(
  rowStart: string,
  rowEnd: string,
  columnAmount: number
) {
  return {
    row_start: rowStart + '1',
    row_end: rowEnd + columnAmount.toString(),
  };
}

export function getFirstSeatAvailableInSeatGroup(
  flight: FlightProps,
  airplane: AirplaneProps,
  bookings: BookingProps[],
  seatGroup: SeatGroupType
): string | boolean {
  // Check if the seat group exists
  if (
    !airplane.seat_groups ||
    !doesAirplaneHaveSeatGroup(airplane, seatGroup)
  ) {
    return false;
  }

  // Get the row_start and row_end for the seat group
  // We can confirm this wil awlays exists because of doesAirplaneHaveSeatGroup
  const group = airplane.seat_groups.find((value) => {
    return value.name == seatGroup;
  });

  // Remove the undefined union type from TypeScript
  if (!group) return false;

  const column_amount = airplane.column_amount;
  let { row_start, row_end } = group;

  const possibleSeatsAvailable = getSeatsAmount(
    row_start,
    row_end,
    column_amount
  );

  // Create a range so ->
  // a1 -> c6 / d1 -> f6
  let range = createSeatRange(row_start, row_end, column_amount);
  row_start = range.row_start;
  row_end = range.row_end;

  try {
    // Get all the bookings for the flight:
    if (!bookings) {
      return false;
    }

    // Record all the taken seats within that seat group
    // and then we can check and see if there are any free
    // seats
    let takenSeats = getTakenSeats(row_start, row_end, bookings);

    // If the amount of seats taken are greater or equal to the
    // amount possible that implies there are no left
    if (takenSeats.length >= possibleSeatsAvailable) {
      return false;
    }

    // Now perform the more expensive operation because we know
    // there are missing seats- we generate a full map of seats
    // that we expect and then find the missing seats by comparing
    // the taken and the expected map
    let missingSeats = findMissingSeats(
      row_start,
      row_end,
      column_amount,
      takenSeats
    );
    return missingSeats[0];
  } catch {
    return false;
  }
}
