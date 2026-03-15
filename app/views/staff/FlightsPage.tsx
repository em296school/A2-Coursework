import {
  Button,
  Checkbox,
  Loader,
  Menu,
  Modal,
  TagsInput,
} from '@mantine/core';
import { BriefcaseIcon } from '../icons/BriefcaseIcon';
import { HistoryIcon } from '../icons/HistoryIcon';
import { RightArrowIcon } from '../icons/RightArrowIcon';
import { DashboardPageTitle } from './StaffDashboard';
import { FlightProps } from '@/app/models/Flights';
import { ALLOWED_AIRPORTS } from '@/app/consts/FlightSettings.json';
import { SetStateAction, useState } from 'react';
import { DeniedIcon } from '../icons/DeniedIcon';
import { useDisclosure } from '@mantine/hooks';
import Validator from '@/app/controllers/Validator/Validator';
import { FlightCreationProps, FlightEdits } from '@/app/types/Flights.types';
import Image from 'next/image';

type FilterOptions = Record<string, string[]>;
const flightSearchFilters = ['to', 'from'];

// Images
import AirbusA220100 from '@/public/planes/airbus_a220_100.png';
import AirbusA220300 from '@/public/planes/airbus_a220_300.png';
import AirbusA319Neo from '@/public/planes/airbus_a319neo.png';
import AirbusA320200Neo from '@/public/planes/airbus_a320_200neo.png';
import AirbusA320300 from '@/public/planes/airbus_a320_300.png';
import Boeing737Max from '@/public/planes/boeing737_max.png';
import Boeing717200 from '@/public/planes/boeing717_200.png';
import Boeing727100 from '@/public/planes/boeing727_100.png';
import Boeing73710 from '@/public/planes/boeing737_10.png';
import Boeing737800 from '@/public/planes/boeing737_800.png';
import Boeing737900 from '@/public/planes/boeing737_900.png';
import Boeing737NG from '@/public/planes/boeing737NG.png';

import { ConfigIcon } from '../icons/ConfigIcon';
import { AirplaneProps } from '@/app/models/Airplanes';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { getSeatCapacity } from '@/app/helpers/getSeats';
import { DateTimePicker, DateTimeStringValue } from '@mantine/dates';
const airplaneImages: Record<string, StaticImport> = {
  'Airbus A220-100': AirbusA220100,
  'Airbus A220-300': AirbusA220300,
  'Airbus A319neo': AirbusA319Neo,
  'Airbus A320-200neo': AirbusA320200Neo,
  'Airbus A320-300': AirbusA320300,
  'Boeing 737-7 MAX': Boeing737Max,
  'Boeing 717-200': Boeing717200,
  'Boeing 727-100': Boeing727100,
  'Boeing 737-10 MAX': Boeing73710,
  'Boeing 737-800': Boeing737800,
  'Boeing 737-900': Boeing737900,
  'Boeing 737NG': Boeing737NG,
};

function createFilterOptions(searchQueries: string[]): FilterOptions {
  // Go through all and create a run
  let _filterOptions: FilterOptions = {
    to: [],
    from: [],
    any: [],
  };

  // Break at a keyword switch, if not
  // append to the respective array in
  // _filterOptions
  let span = _filterOptions.any;
  for (let query of searchQueries) {
    // Remove any ':' from the query as this
    // exists purely for the user's ease to let them
    // know its an instruction
    query = query.replace(':', '');

    if (flightSearchFilters.includes(query) && query in _filterOptions) {
      span = _filterOptions[query];
      continue;
    }

    span.push(query);
  }

  return _filterOptions;
}
async function fetchFlights(
  filterOptions: FilterOptions,
  setSearching: React.Dispatch<SetStateAction<boolean>>,
  setFlights: React.Dispatch<SetStateAction<FlightProps[]>>
) {
  // Go through the filter options and sort
  try {
    const response = await fetch('/api/dashboard/get-flights', {
      body: JSON.stringify(filterOptions),
      method: 'POST',
    });

    if (!response.ok) {
      setSearching(false);
      setFlights([]);
      return;
    }

    let result = await response.json();
    setSearching(false);
    setFlights(result);
  } catch (err) {
    console.log(err);
    setSearching(false);
    setFlights([]);
  }
}

async function fetchAirplanes() {
  try {
    const response = await fetch('/api/dashboard/get-airplanes', {
      method: 'GET',
    });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (err) {
    return [];
  }
}

async function editFlight({ edits }: { edits: FlightEdits }): Promise<boolean> {
  try {
    const response = await fetch('/api/dashboard/edit-flight', {
      body: JSON.stringify(edits),
      method: 'POST',
    });

    if (!response) {
      return false;
    }

    if (response.ok) {
      return true;
    }

    return false;
  } catch (err) {
    return false;
  }
}

function FlightInteractionButton({
  onClick,
  isExpired,
  children,
}: {
  onClick: () => void;
  isExpired: boolean;
  children: string;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-black/10 p-1 not-disabled:hover:shadow-sm disabled:cursor-not-allowed"
      disabled={isExpired}
    >
      {children}
    </button>
  );
}

function FlightResult({
  flight,
  filterOptions,
}: {
  flight: FlightProps;
  filterOptions: FilterOptions;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [cancelOpened, cancelHandler] = useDisclosure(false);
  const [cancelled, setCancelled] = useState<boolean>(false);
  const [submittingEdit, setSubmittingEdit] = useState<boolean>(false);
  const [outdated, setOutdated] = useState<boolean>(false);
  const [edits, setEdits] = useState<FlightEdits>({});

  let isExpired =
    Date.now() > new Date(flight.flight_info.departure_date).getTime();

  function setEdit(field: string) {
    return function (value: any) {
      setEdits((prev) => ({
        ...prev,
        [field]: value,
      }));
    };
  }

  async function cancelFlight() {
    if (cancelled) return;

    let body = {
      flightId: flight.flight_id,
    };

    const response = await fetch('/api/dashboard/cancel-flight', {
      body: JSON.stringify(body),
      method: 'POST',
    });

    cancelHandler.close();

    if (response.ok) {
      setCancelled(true);
      alert('Successfully cancelled this flight.');
      return;
    }

    alert("Couldn't cancel flight.");
  }

  async function submitEdits() {
    // check
    let validator = new Validator(edits);
    if (!validator.validateFlightEdits || isExpired) {
      return;
    }

    close();

    // Reference the flightId to the edits dictionary
    // and tell the server we want to edit this flight
    // with these edits
    setSubmittingEdit(true);
    const success = await editFlight({
      edits: {
        ...edits,
        flightId: flight.flight_id,
      },
    });

    if (success) {
      setOutdated(true);
      alert('Successfully edited flight.');
    } else {
      alert('Could not edit flight at this time.');
    }

    // Reload the page to get our changes
    setSubmittingEdit(false);
  }

  if (cancelled) {
    return;
  }
  return (
    <>
      <Modal
        opened={cancelOpened}
        onClose={cancelHandler.close}
        title={'Are you sure?'}
        centered
      >
        <div className="flex flex-col gap-8">
          <span className="text-md text-black/50">
            Are you sure you want to cancel this flight?
          </span>
          <div className="flex flex-row justify-center gap-2 w-full">
            <button
              onClick={cancelFlight}
              className="rounded-lg text-white text-lg font-medium bg-button-success px-3 py-2 h-10 items-center shadow-black/20 hover:shadow-lg duration-150"
            >
              Cancel this flight
            </button>
            <button
              onClick={cancelHandler.close}
              className="rounded-lg text-white text-lg font-medium bg-button-danger px-3 py-2 h-10 items-center shadow-black/20 hover:shadow-lg duration-150"
            >
              Nevermind
            </button>
          </div>
        </div>
      </Modal>
      {!isExpired ? (
        <Modal
          opened={opened}
          onClose={close}
          title={`Edit Flight #${flight.flight_id}`}
          centered
        >
          <div className="flex flex-col w-full h-fit gap-2">
            <div className="relative h-3 w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="h-px w-full bg-black/20 z-0" />
              </div>
              <div className="absolute inset-0 flex justify-center items-center w-full h-full">
                <h2 className="flex justify-center text-[8px] font-semibold text-black/20 bg-white w-fit px-4">
                  LOCATIONS
                </h2>
              </div>
            </div>
            <div className="flex flex-row justify-start gap-5 w-full">
              <div className="flex flex-col gap-1 w-full text-xs text-black/30">
                <h2 className="text-[10px] font-normal">Departure</h2>
                <input
                  type="text"
                  className="w-full rounded-md p-1 text-black/40 cursor-not-allowed bg-white border border-black/10"
                  placeholder={flight.flight_info.departure_location}
                  disabled
                />
              </div>
              <div className="flex flex-col gap-1 w-full text-xs text-black/30">
                <h2 className="text-[10px] font-normal">Arrival</h2>
                <input
                  type="text"
                  className="w-full rounded-md p-1 text-black/40 cursor-not-allowed bg-white border border-black/10"
                  placeholder={flight.flight_info.arrival_location}
                  disabled
                />
              </div>
            </div>
            <div id="divider" className="mt-3"></div>
            <div className="relative h-3 w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="h-px w-full bg-black/20 z-0" />
              </div>
              <div className="absolute inset-0 flex justify-center items-center w-full h-full">
                <h2 className="flex justify-center text-[8px] font-semibold text-black/20 bg-white w-fit px-4">
                  SPECIFICATIONS
                </h2>
              </div>
            </div>
            <div className="flex flex-row justify-start gap-5 w-full">
              <div className="flex flex-col gap-1 w-full text-xs text-black/30">
                <h2 className="text-[10px] font-normal">Base price</h2>
                <div className="flex flex-row gap-2 w-full rounded-md p-1 text-black bg-white border border-black/10">
                  <span className="text-gg-green">£</span>
                  <input
                    type="text"
                    className="outline-none"
                    onChange={(v) =>
                      setEdit('basePrice')(v.currentTarget.value)
                    }
                    placeholder={`${flight.flight_info.base_price.toFixed(2)}`}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center w-full text-[12px] mt-5">
              <button
                onClick={submitEdits}
                className="px-3 py-1 bg-gg-green rounded-md shadow-md text-white font-medium hover:bg-green-950"
              >
                Submit
              </button>
            </div>
          </div>
        </Modal>
      ) : (
        <></>
      )}
      <div
        key={flight.flight_id}
        className={`flex flex-row gap-3 justify-start items-center select-none text-black/${isExpired ? '20' : '50'} ${isExpired ? 'cursor-not-allowed' : ''} rounded-lg w-full h-8 p-1 font-medium hover:bg-black/2 duration-150`}
      >
        {submittingEdit ? (
          <div className="flex justify-center w-full h-full">
            <Loader size={13} />
          </div>
        ) : (
          <>
            {isExpired ? (
              <DeniedIcon size={13} strokeWidth={2} />
            ) : (
              <HistoryIcon size={13} strokeWidth={2} />
            )}
            <h2 className="flex flex-row w-30 items-center gap-2 text-sm truncate">
              <>
                {filterOptions.from.find(
                  (option) => option == flight.flight_info.departure_location
                ) ? (
                  <span className="bg-green-200 max-w-20 truncate">
                    {flight.flight_info.departure_location}
                  </span>
                ) : (
                  <span className="max-w-20 truncate">
                    {flight.flight_info.departure_location}
                  </span>
                )}
                <RightArrowIcon size={13} strokeWidth={2} />
                {filterOptions.to.find(
                  (option) => option == flight.flight_info.arrival_location
                ) ? (
                  <span className="bg-green-200 max-w-20 truncate">
                    {flight.flight_info.arrival_location}
                  </span>
                ) : (
                  <span className="max-w-20 truncate">
                    {flight.flight_info.arrival_location}
                  </span>
                )}
              </>
            </h2>
            {outdated ? (
              <h2 className="flex flex-row font-bold text-black/20 text-[10px] gap-1">
                EDITED
              </h2>
            ) : (
              <div className="flex flex-row text-xs gap-1">
                <FlightInteractionButton isExpired={isExpired} onClick={open}>
                  Edit
                </FlightInteractionButton>
                <FlightInteractionButton
                  isExpired={isExpired}
                  onClick={cancelHandler.open}
                >
                  Cancel
                </FlightInteractionButton>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

function FlightCreationSection() {
  const [initialCacheSet, setInitialCacheSet] = useState<boolean>(false);
  const [airplaneCache, setAirplaneCache] = useState<AirplaneProps[]>([]);
  const [creationProps, setCreationProps] = useState<FlightCreationProps>({
    airplane: '',
    departure_date: '',
    departure_location: '',
    arrival_location: '',
    base_price: '',
    sells_food: false,
  });

  function setProps(field: string) {
    return function (value: string | boolean) {
      setCreationProps((prev) => ({
        ...prev,
        [field]: value,
      }));
    };
  }

  function setDate(field: string) {
    return function (value: DateTimeStringValue | null) {
      if (value == null) {
        value = '';
      }

      setCreationProps((prev) => ({
        ...prev,
        [field]: value,
      }));
    };
  }

  async function submitCreation() {
    const validator = new Validator(creationProps);

    if (!validator.validateFlightCreation()) {
      alert('You have missing or invalid fields.');
      return;
    }

    try {
      const response = await fetch('/api/dashboard/create-flight', {
        body: JSON.stringify(creationProps),
        method: 'POST',
      });

      if (!response.ok) {
        alert('Could not create flight at this time.');
        return;
      }

      alert('Successfully created flight.');
      window.location.reload();
    } catch {
      alert('Could not create flight at this time.');
    }
  }

  function getAirplane(name: string) {
    return airplaneCache.find((airplane) => airplane.name === name);
  }

  async function getAirplanes(): Promise<AirplaneProps[]> {
    return await fetchAirplanes();
  }

  if (!initialCacheSet) {
    getAirplanes().then((airplanes) => {
      setAirplaneCache(airplanes);
      setInitialCacheSet(true);

      let airplane = airplanes[0];
      setProps('airplane')(airplane.name);
    });
  }

  let currentAirplane = getAirplane(creationProps.airplane);
  let seatingCapacity = currentAirplane ? getSeatCapacity(currentAirplane) : 0;
  let airports = Array.from(ALLOWED_AIRPORTS, (v) => v);

  return (
    <div className="flex flex-col gap-3 justify-start">
      <div className="flex flex-row w-120 gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex flex-col py-1 items-center rounded-lg shadow-sm border border-black/25 bg-white w-75 h-40 hover:border-black/60 duration-150">
            <h2 className="px-2 w-full text-xs text-black/20 font-bold">
              MODEL
              {creationProps.airplane !== ''
                ? ` | ${creationProps.airplane.toUpperCase()}`
                : ''}
            </h2>
            <Menu shadow="md" position="bottom-start" width={283}>
              <Menu.Target>
                <button className="px-2 w-full h-full">
                  {airplaneImages[creationProps.airplane] ? (
                    <Image
                      alt={creationProps.airplane}
                      src={airplaneImages[creationProps.airplane]}
                      width={400}
                    />
                  ) : (
                    <></>
                  )}
                </button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Airplane Models</Menu.Label>
                {airplaneCache.map((airplane, index) => {
                  let airplaneIsSelected =
                    creationProps.airplane == airplane.name;
                  return (
                    <Menu.Item
                      key={index}
                      leftSection={<ConfigIcon size={14} />}
                      onClick={(e) =>
                        setProps('airplane')(e.currentTarget.value)
                      }
                      value={airplane.name}
                    >
                      <span
                        className={`${airplaneIsSelected ? 'text-black/50' : ''}`}
                      >
                        {airplane.name}
                      </span>
                    </Menu.Item>
                  );
                })}
              </Menu.Dropdown>
            </Menu>
          </div>
          <div className="flex flex-row w-full gap-1 items-center">
            <div className="flex flex-col text-sm w-30 mt-2 gap-1">
              <h2 className="font-medium text-xs text-black/30">
                Departure Airport
              </h2>
              <Menu shadow="md" position="bottom-start" width={160}>
                <Menu.Target>
                  <button
                    className="w-full font-normal text-black/50 p-2 border border-black/20 rounded-sm cursor-pointer outline-none"
                    value={creationProps.departure_location}
                  >
                    {creationProps.departure_location === ''
                      ? 'Select airport'
                      : creationProps.departure_location}
                  </button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Airports</Menu.Label>
                  {Array.from(airports).map((airport, index) => {
                    let airportIsSelected =
                      creationProps.departure_location == airport;
                    let airportIsOther =
                      creationProps.arrival_location == airport;
                    return (
                      <Menu.Item
                        key={index}
                        leftSection={
                          airportIsOther ? (
                            <DeniedIcon size={14} strokeWidth={2} />
                          ) : (
                            <BriefcaseIcon
                              size={14}
                              strokeWidth={2}
                              color={airportIsSelected ? 'white' : 'black'}
                            />
                          )
                        }
                        onClick={(e) => {
                          if (airportIsOther) return;
                          setProps('departure_location')(e.currentTarget.value);
                        }}
                        value={airport}
                        disabled={airportIsOther}
                        bg={airportIsSelected ? 'green' : undefined}
                      >
                        <span
                          className={`${airportIsSelected ? 'text-white' : ''}`}
                        >
                          {airport}
                        </span>
                      </Menu.Item>
                    );
                  })}
                </Menu.Dropdown>
              </Menu>
            </div>
            <RightArrowIcon
              size={30}
              strokeWidth={1.5}
              opacity={0.2}
              className="mx-1 mt-5"
            />
            <div className="flex flex-col text-sm w-30 mt-2 gap-1">
              <h2 className="font-medium text-xs text-black/30">
                Arrival Airport
              </h2>
              <Menu shadow="md" position="bottom-start" width={160}>
                <Menu.Target>
                  <button
                    className="w-full font-normal text-black/50 p-2 border border-black/20 rounded-sm cursor-pointer outline-none"
                    value={creationProps.arrival_location}
                  >
                    {creationProps.arrival_location === ''
                      ? 'Select airport'
                      : creationProps.arrival_location}
                  </button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Airports</Menu.Label>
                  {Array.from(airports).map((airport, index) => {
                    let airportIsSelected =
                      creationProps.arrival_location == airport;
                    let airportIsOther =
                      creationProps.departure_location == airport;
                    return (
                      <Menu.Item
                        key={index}
                        leftSection={
                          airportIsOther ? (
                            <DeniedIcon size={14} strokeWidth={2} />
                          ) : (
                            <BriefcaseIcon
                              size={14}
                              strokeWidth={2}
                              color={airportIsSelected ? 'white' : 'black'}
                            />
                          )
                        }
                        onClick={(e) => {
                          if (airportIsOther) return;
                          setProps('arrival_location')(e.currentTarget.value);
                        }}
                        value={airport}
                        disabled={airportIsOther}
                        bg={airportIsSelected ? 'green' : undefined}
                      >
                        <span
                          className={`${airportIsSelected ? 'text-white' : ''}`}
                        >
                          {airport}
                        </span>
                      </Menu.Item>
                    );
                  })}
                </Menu.Dropdown>
              </Menu>
            </div>
          </div>
          <button
            onClick={submitCreation}
            className="py-1 mt-2 text-white rounded-md shadow-sm bg-gg-green w-25 hover:bg-green-950 duration-150"
          >
            <span className="font-medium">Create</span>
          </button>
        </div>
        <div className="flex flex-col px-2 py-1 items-center rounded-lg shadow-sm border border-black/25 bg-white w-50 h-69">
          <h2 className="w-full text-xs text-black/20 font-bold">SETTINGS</h2>
          <div className="flex flex-col text-sm w-full mt-2 gap-1">
            <h2 className="font-medium text-xs text-black/30">Capacity</h2>
            <input
              className="w-full font-normal text-black p-2 border border-black/20 rounded-sm disabled:cursor-not-allowed disabled:text-black/40"
              placeholder={seatingCapacity.toString()}
              disabled
            />
          </div>
          <div className="flex flex-col text-sm w-full mt-2 gap-1">
            <h2 className="font-medium text-xs text-black/30">Departure</h2>
            <DateTimePicker
              placeholder="Select date"
              onChange={setDate('departure_date')}
            />
          </div>
          <div className="flex flex-col text-sm w-full mt-2 gap-1">
            <h2 className="font-medium text-xs text-black/30">Base Price</h2>
            <input
              className="w-full font-normal text-black p-2 border border-black/20 rounded-sm outline-none"
              onChange={(e) => setProps('base_price')(e.currentTarget.value)}
              placeholder={'50.00'}
            />
          </div>
          <div className="flex flex-col text-sm w-full mt-2 gap-1">
            <h2 className="font-medium text-xs text-black/30">Sells Food</h2>
            <Checkbox
              label="Sells Food"
              onChange={(e) => setProps('sells_food')(e.currentTarget.checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FlightSearchSection() {
  const [searching, setSearching] = useState<boolean>(false);
  const [flights, setFlights] = useState<FlightProps[]>([]);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);

  const Airports = Object.values(ALLOWED_AIRPORTS);
  const filterOptions = createFilterOptions(searchQueries);

  function canSearch() {
    return !searching && searchQueries.length > 0;
  }
  async function search() {
    if (!canSearch()) return;

    setSearching(true);
    await fetchFlights(filterOptions, setSearching, setFlights);
  }

  return (
    <div className="flex flex-col rounded-lg px-2 py-1 shadow-sm border border-black/25 h-full w-100">
      <div className="flex flex-col text-sm gap-1">
        <h2 className="text-xs text-black/20 font-bold">SEARCH</h2>
        <TagsInput
          placeholder="Search flights"
          data={[
            { group: 'Airports', items: Airports },
            { group: 'Filters', items: flightSearchFilters },
          ]}
          acceptValueOnBlur={false}
          onChange={setSearchQueries}
          clearable
        />
        <button
          onClick={search}
          className="flex items-center h-7 w-fit px-2 py-1 bg-gg-green text-white rounded-lg cursor-pointer hover:bg-green-950 duration-150 disabled:bg-black/20 disabled:cursor-not-allowed"
          disabled={!canSearch()}
        >
          <span className="text-xs font-medium">Search</span>
        </button>
      </div>
      {!searching && flights.length > 0 ? (
        <>
          <div id="divider" className="w-full h-5" />
          <h2 className="text-xs text-black/20 font-bold">RESULTS</h2>
        </>
      ) : (
        <></>
      )}
      <div className="w-full max-h-100 overflow-auto bg-white transition-all duration-150">
        {searching ? (
          <div className="flex justify-center items-center w-full h-50">
            <Loader />
          </div>
        ) : (
          flights.map((flight) => {
            return (
              <FlightResult flight={flight} filterOptions={filterOptions} />
            );
          })
        )}
      </div>
    </div>
  );
}

export default function FlightsPage() {
  return (
    <div className="flex flex-col w-full gap-2">
      <DashboardPageTitle
        icon={<BriefcaseIcon size={25} strokeWidth={2} />}
        title="Flights"
        description="Manage flights."
      />
      <div className="flex flex-row gap-2">
        <FlightCreationSection />
        <FlightSearchSection />
      </div>
    </div>
  );
}
