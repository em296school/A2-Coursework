import { Dispatch, SetStateAction, useState } from 'react';
import { PersonOptionsProps } from './PreferencesMenu';
import { BriefcaseIcon } from '../icons/BriefcaseIcon';
import Selector from './PersonPreference/Selector';

import { FIRST_NAME, LAST_NAME } from '@/app/consts/AccountPropsSettings.json';
import { MAX_PASSENGERS } from '@/app/consts/PassengersSettings.json';
import { CrossIcon } from '../icons/CrossIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { AccountProps } from '@/app/models/Accounts';
import { formatToName } from '@/app/helpers/formatToName';
import { UserIcon } from '../icons/UserIcon';
import { Tooltip } from '@mantine/core';

let firstNameRegEx = new RegExp(FIRST_NAME.REGEX);
let lastNameRegEx = new RegExp(LAST_NAME.REGEX);

const DEFAULT_DRAFT = {
  first_name: '',
  last_name: '',
  seat: '',
  requires_assistance: false,
  wheelchair: false,
  key: 0,
};

export function PreferencesAdditionalOptions({
  personPreferences,
  setPersonPreferences,
  account,
}: {
  personPreferences: PersonOptionsProps[];
  setPersonPreferences: Dispatch<SetStateAction<PersonOptionsProps[]>>;
  account: AccountProps;
}) {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [personDraft, setPersonDraft] =
    useState<PersonOptionsProps>(DEFAULT_DRAFT);

  function resetForm() {
    // Then we just clear the other inputs to prevent spam
    // and also for UX
    let firstName = document.getElementById(
      'preferences_draft-first_name#input'
    );
    let lastName = document.getElementById('preferences_draft-last_name#input');
    // Remove the HTMLElement type from each of these
    // and reassign the input to allow .value to be set.
    if (firstName) {
      (firstName as unknown as HTMLInputElement).value = '';
    }
    if (lastName) {
      (lastName as unknown as HTMLInputElement).value = '';
    }

    // Also need to clear the React state
    setPersonDraft({
      ...DEFAULT_DRAFT,
      requires_assistance: personDraft.requires_assistance,
      wheelchair: personDraft.wheelchair,
    });
    setErrorMessage('');
  }

  function addDraft() {
    // Assign a key to the draft just so we can allow it to be deleted
    // as it's possible two passengers may have the exact same
    personDraft.key = personPreferences.length + 1;

    // Spread the personPreferences and add the personDraft
    setPersonPreferences([...personPreferences, personDraft]);

    // Reset the form
    resetForm();
  }

  function addPassenger() {
    // Check if the inputs are valid:
    let { first_name, last_name } = personDraft;

    if (!firstNameRegEx.test(first_name) || !lastNameRegEx.test(last_name)) {
      setErrorMessage(`Name(s) ${FIRST_NAME.HINT.toLowerCase()}`);
      return;
    }

    if (personPreferences.length >= MAX_PASSENGERS) {
      setErrorMessage(`You may only include ${MAX_PASSENGERS} passengers.`);
      return;
    }

    addDraft();
  }

  function addMyself() {
    if (personPreferences.length >= MAX_PASSENGERS) {
      setErrorMessage(`You may only include ${MAX_PASSENGERS} passengers.`);
      return;
    }

    // We don't need to validate the account props as
    // thats already validated so we just pass it through
    // We also format the first_name because data is not stored in format:
    personDraft.first_name = formatToName(account.first_name);
    personDraft.last_name = formatToName(account.last_name);

    // These boolean options are not set on sign up so
    // they might be undefined
    personDraft.requires_assistance =
      typeof account.requires_assistance == 'boolean'
        ? account.requires_assistance
        : false;

    personDraft.wheelchair =
      typeof account.wheelchair == 'boolean' ? account.wheelchair : false;

    addDraft();
  }

  function removePassenger(key: number) {
    setPersonPreferences((prev) =>
      prev.filter((passenger) => passenger.key != key)
    );
  }

  function setDraftOption(option: string) {
    return function (value: string | boolean) {
      setPersonDraft({
        ...personDraft,
        [option]: value,
      });
    };
  }

  return (
    <div className="flex flex-col gap-1 w-full h-fit rounded-2xl shadow-lg border-2 border-gray-200 px-6 py-4">
      <h2 className="flex flex-row gap-2 font-semibold text-2xl text-black/70 items-center">
        <BriefcaseIcon size={30} strokeWidth={2} />
        Passengers
      </h2>
      <div className="relative h-3 w-full my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="h-px w-full bg-black/40 z-0" />
        </div>
        <div className="absolute inset-0 flex justify-center items-center w-full h-full">
          <h2 className="flex flex-row gap-2 justify-center items-center text-sm font-semibold text-black/40 bg-white w-fit px-4">
            <UserIcon size={15} />
            {personPreferences.length}/{MAX_PASSENGERS} PASSENGERS
          </h2>
        </div>
      </div>
      <div className="flex flex-col gap-1 h-fit w-full my-2">
        {personPreferences.map((passenger) => {
          return (
            <div className="rounded-md shadow-lg w-full h-20 bg-white p-2 border border-black/10">
              <div className="flex flex-row justify-start">
                <h2 className="text-lg font-semibold w-100">
                  {passenger.last_name.toUpperCase()}, {passenger.first_name}
                </h2>
                <div className="flex justify-end w-full">
                  <button
                    onClick={() => {
                      if (passenger.key) {
                        removePassenger(passenger.key);
                      }
                    }}
                    className="flex justify-center items-center bg-white rounded-lg w-6 h-6 shadow-black/20 hover:shadow-lg duration-200"
                  >
                    <CrossIcon size={15} strokeWidth={2} />
                  </button>
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <Tooltip label="Seat">
                  <h2 className="flex select-none justify-center items-center text-xs font-semibold text-black/40 bg-black/10 rounded-lg py-1 px-2 w-fit">
                    {passenger.seat === ''
                      ? 'NO SEAT'
                      : passenger.seat.toUpperCase()}
                  </h2>
                </Tooltip>
                {passenger.requires_assistance ? (
                  <h2 className="flex flex-row gap-1 text-xs text-black/40 items-center">
                    <CheckIcon size={10} strokeWidth={3} />
                    Passenger requires assistance
                  </h2>
                ) : (
                  <></>
                )}
                {passenger.wheelchair ? (
                  <h2 className="flex flex-row gap-1 text-xs text-black/40 items-center">
                    <CheckIcon size={10} strokeWidth={3} />
                    Passenger uses a wheelchair
                  </h2>
                ) : (
                  <></>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <Selector>
        <div className="flex flex-row gap-3 w-full">
          <Selector.StringOption
            id="preferences_draft-first_name#input"
            placeholder="John"
            onChange={setDraftOption('first_name')}
          >
            First name
          </Selector.StringOption>
          <Selector.StringOption
            id="preferences_draft-last_name#input"
            placeholder="Smith"
            onChange={setDraftOption('last_name')}
          >
            Last name
          </Selector.StringOption>
        </div>
        <div className="flex flex-row gap-3 w-full">
          <Selector.BooleanOption
            onChange={setDraftOption('requires_assistance')}
          >
            This person requires assistance
          </Selector.BooleanOption>
          <Selector.BooleanOption onChange={setDraftOption('wheelchair')}>
            Wheelchair user
          </Selector.BooleanOption>
        </div>
        <div className="flex flex-row gap-2">
          <Selector.Submit onClick={addPassenger}>
            Add passenger
          </Selector.Submit>
          <Selector.SubmitMyself onClick={addMyself} />
        </div>
      </Selector>
      <Selector.Error>{errorMessage}</Selector.Error>
    </div>
  );
}
