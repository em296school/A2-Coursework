'use client';
import {
  createSeatRange,
  getTakenSeats,
  mapAllSeats,
} from '@/app/helpers/getSeats';
import { AirplaneProps, SeatGroupType } from '@/app/models/Airplanes';
import { BookingProps } from '@/app/models/Bookings';
import { Tooltip, Transition } from '@mantine/core';
import { DeniedIcon } from '../icons/DeniedIcon';
import { PersonOptionsProps } from './PreferencesMenu';
import { SetStateAction, useState } from 'react';
import { BriefcaseIcon } from '../icons/BriefcaseIcon';

export interface AirplaneSeatingProps {
  airplane: AirplaneProps;
  bookings: BookingProps[];
  passengers: PersonOptionsProps[];
  setPassengers: React.Dispatch<SetStateAction<PersonOptionsProps[]>>;
}

function PassengerSeat({
  children,
  disabled,
  alreadyHasSeat,
  onClick,
}: {
  children: string;
  disabled?: boolean;
  alreadyHasSeat?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-row gap-2 border border-current/0 
        items-center w-full h-6 px-2 py-3.5 rounded-lg hover:bg-current/4
        hover:border-current/60 transition-all duration-300 
        ${disabled ? 'text-gg-green' : alreadyHasSeat ? 'text-current/40 line-through' : 'text-current/70'}`}
    >
      {disabled ? <BriefcaseIcon size={17} strokeWidth={2} /> : <></>}
      {children}
    </div>
  );
}

function Seat({
  disabled,
  name,
  children,
  occupant,
}: {
  disabled: boolean;
  name: string;
  children: React.ReactElement[] | undefined;
  occupant?: string;
}) {
  const [hovering, setHovering] = useState<boolean>(false);
  const occupiedBar = (
    <div className="flex justify-center items-center relative w-full h-full overflow-hidden rounded-lg">
      <div className="absolute bg-current rotate-45 w-[150%] h-1" />
    </div>
  );
  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Tooltip
        label={
          disabled ? 'Seat taken' : occupant ? occupant : name.toUpperCase()
        }
      >
        <div
          className={`flex justify-center items-center w-10 h-10 rounded-lg bg-black/50 ${!disabled ? 'hover:bg-gg-green' : ''} duration-200`}
          style={{
            opacity: disabled || occupant ? 0.3 : 1,
          }}
        >
          {disabled ? (
            <DeniedIcon size={25} strokeWidth={2} />
          ) : occupant ? (
            occupiedBar
          ) : (
            <></>
          )}
        </div>
      </Tooltip>
      {!disabled && children ? (
        <Transition
          mounted={hovering}
          transition={'scale-y'}
          duration={400}
          timingFunction={'ease'}
        >
          {(styles) => {
            return (
              <div
                style={styles}
                className="absolute select-none min-w-40 z-2 bg-white shadow-lg px-2 py-4"
              >
                <h2 className="text-sm text-black/40 font-bold">PASSENGER</h2>
                {children.map((passenger) => {
                  return passenger;
                })}
              </div>
            );
          }}
        </Transition>
      ) : (
        <></>
      )}
    </div>
  );
}

export function PreferencesAirplaneSeating(props: AirplaneSeatingProps) {
  let columnAmount = props.airplane.column_amount;

  return (
    <div className="flex flex-col items-center gap-1 w-[40%] h-fit rounded-2xl shadow-lg border-2 border-gray-200 p-3">
      {props.airplane.seat_groups?.map((group) => {
        // Mapped seats:
        let column1Range = Math.floor(columnAmount / 2);
        let mappedSeats = mapAllSeats(
          group.row_start,
          group.row_end,
          columnAmount
        );

        // Get the taken seats for comparison:
        // Create a range so ->
        // a1 -> c6 / d1 -> f6
        let { row_start, row_end } = createSeatRange(
          group.row_start,
          group.row_end,
          columnAmount
        );
        let takenSeats = getTakenSeats(row_start, row_end, props.bookings);

        // Sort the seats to rows & columns
        let layout = [];
        let currentRow = mappedSeats[0].charAt(0); // get the letter from the seat so 'a1' = 'a'
        let currentRowIndex = 0;

        for (let seat of mappedSeats) {
          let seatRow = seat.charAt(0);
          let seatCol = Number(seat.slice(1));
          let aisleIndex = seatCol <= column1Range ? 0 : 1;

          if (seatRow == currentRow) {
            if (!layout[currentRowIndex]) {
              layout[currentRowIndex] = [[], []];
            }
            // We add it to the index in the layout
            layout[currentRowIndex][aisleIndex].push(seat as never);
          } else {
            currentRow = seatRow;
            currentRowIndex += 1;
            if (!layout[currentRowIndex]) {
              layout[currentRowIndex] = [[], []];
            }

            layout[currentRowIndex][aisleIndex].push(seat as never);
          }
        }

        function isReserved(seat: string): boolean {
          return takenSeats.includes(seat);
        }

        // Whether a passenger in the current booking has selected this seat
        // and anticipates to buy it
        function getOccupantForBooking(seat: string) {
          return props.passengers.find((passenger) => passenger.seat == seat);
        }

        return (
          <div className="flex flex-col gap-1 w-full justify-center items-center my-2">
            <div className="relative h-3 w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="h-px w-full bg-black/20 z-0" />
              </div>
              <div className="absolute inset-0 flex justify-center items-center w-full h-full">
                <h2 className="flex justify-center text-xs font-semibold text-black/20 bg-white w-fit px-4">
                  {group.name.toUpperCase().replace('_', ' ')}
                </h2>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-1 w-full mt-2">
              {layout.map((row) => {
                return (
                  <div className="flex flex-row justify-center gap-6 w-full">
                    {row.map((aisle) => {
                      return (
                        <div className="flex flex-row gap-1 h-full w-fit">
                          {aisle.map((seat) => {
                            let occupant = getOccupantForBooking(seat);
                            return (
                              <Seat
                                disabled={isReserved(seat)}
                                occupant={
                                  occupant
                                    ? `${occupant.first_name} ${occupant.last_name}`
                                    : undefined
                                }
                                name={seat}
                              >
                                {props.passengers.map((passenger, index) => {
                                  return (
                                    <PassengerSeat
                                      key={index}
                                      disabled={passenger.seat === seat}
                                      alreadyHasSeat={passenger.seat !== ''}
                                      onClick={() => {
                                        props.setPassengers((prev) =>
                                          prev.map((item) => {
                                            if (item.key == passenger.key) {
                                              let targetSeat =
                                                seat == passenger.seat
                                                  ? ''
                                                  : seat;
                                              return {
                                                ...item,
                                                seat: targetSeat,
                                              };
                                            } else if (item.seat == seat) {
                                              item.seat = '';
                                            }
                                            return item;
                                          })
                                        );
                                      }}
                                    >{`${passenger.first_name} ${passenger.last_name}`}</PassengerSeat>
                                  );
                                })}
                              </Seat>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
