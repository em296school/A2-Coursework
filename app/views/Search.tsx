'use client';
import { useState } from 'react';
import { DBSearchQuery } from '../types/Flights.types';
import { DateTimePicker } from '@mantine/dates';
import { RangeSlider, Tooltip } from '@mantine/core';
import {
  MINIMUM_FLIGHT_PRICE,
  MAXIMUM_FLIGHT_PRICE,
} from '@/app/consts/FlightSettings.json';
import { useRouter } from 'next/navigation';
import { CrossIcon } from './icons/CrossIcon';

export type SearchQuery = Record<string, string>;
/**
  destination: String | undefined;
  departure: String | undefined;
  min_date: String | undefined;
  max_date: String | undefined;
  min_price: String | undefined;
  max_price: String | undefined;
**/

interface SearchComponentProps {
  setFn: SetFn;
  index: number;
}

type SetFn = (key: string, value: string, search?: boolean) => void;

function SearchBar(name: string, key: string) {
  return function ({ setFn, index }: SearchComponentProps) {
    const [searchInput, setSearchInput] = useState<string>('');

    function submitSearch() {
      setFn(key, searchInput, true);
    }

    return (
      <div
        key={index}
        className="flex flex-col gap-1 w-full text-black/20 font-semibold text-sm"
      >
        <h2>{name.toUpperCase()}</h2>
        <div className="flex flex-row w-full gap-1">
          <input
            onChange={(e) => {
              setSearchInput(e.currentTarget.value);
            }}
            className="w-full text-lg font-normal text-black p-2 border border-black/20 shadow-lg rounded-lg"
            placeholder="Search"
          />
          <Tooltip label="Search">
            <button
              onClick={submitSearch}
              className="p-2 bg-gg-green shadow-black/20 text-white text-lg font-semibold rounded-lg hover:shadow-lg duration-150"
            >
              Search
            </button>
          </Tooltip>
        </div>
      </div>
    );
  };
}

function Range(
  rangeName: string,
  keyStart: string,
  keyEnd: string,
  labelStart: string,
  labelEnd: string
) {
  return function ({ setFn, index }: SearchComponentProps) {
    function submitStart(value: string | null) {
      if (!value) {
        setFn(keyStart, '');
        return;
      }
      setFn(keyStart, value);
    }

    function submitEnd(value: string | null) {
      if (!value) {
        setFn(keyEnd, '');
        return;
      }
      setFn(keyEnd, value);
    }

    return (
      <div
        key={index}
        className="flex flex-col gap-1 w-full text-black/20 font-semibold text-sm"
      >
        <h2>{rangeName.toUpperCase()}</h2>
        <div className="flex flex-row w-full gap-1">
          <DateTimePicker
            className="w-full shadow-lg"
            label={labelStart}
            placeholder="Select date"
            onChange={submitStart}
          />
          <DateTimePicker
            className="w-full shadow-lg"
            label={labelEnd}
            placeholder="Select date"
            onChange={submitEnd}
          />
        </div>
      </div>
    );
  };
}

function Slider(sliderName: string, keyStart: string, keyEnd: string) {
  return function ({ setFn, index }: SearchComponentProps) {
    function submit(value: [number, number]) {
      let minPrice = value[0].toString();
      let maxPrice = value[1].toString();

      setFn(keyStart, minPrice);
      setFn(keyEnd, maxPrice);
    }

    let min = MINIMUM_FLIGHT_PRICE;
    let max = MAXIMUM_FLIGHT_PRICE;

    let delta = max - min;
    let mid = min + delta / 2;

    return (
      <div
        key={index}
        className="flex flex-col gap-1 w-full text-black/20 font-semibold text-sm"
      >
        <h2>{sliderName.toUpperCase()}</h2>
        <div className="flex justify-center w-full gap-1 pb-4">
          <RangeSlider
            className="w-[90%] text-black/20"
            domain={[min, max]}
            min={min}
            max={max}
            onChange={submit}
            marks={[
              { value: min, label: `£${min.toFixed(2)}` },
              { value: mid, label: `£${mid.toFixed(2)}` },
              { value: max, label: `£${max.toFixed(2)}` },
            ]}
            labelTransitionProps={{
              transition: 'fade-up',
              duration: 150,
              timingFunction: 'linear',
            }}
          />
        </div>
      </div>
    );
  };
}

export function Search({ href }: { href: string }) {
  const router = useRouter();
  const [search, setSearch] = useState<SearchQuery>({});

  function setSearchForField(key: string, value: string, searchUp?: boolean) {
    setSearch((prev) => ({
      ...prev,
      [key]: value,
    }));

    // React state update is usually deferred, we
    // create a local temp. copy for our up-to-date
    // search
    let upToDateSearch = search;
    upToDateSearch[key] = value;

    if (searchUp) {
      let query = '';

      for (let [key, value] of Object.entries(upToDateSearch)) {
        query += key + '=' + value + '&';
      }
      router.push(`${href}?` + query);
    }
  }

  function searchNothing() {
    router.push(href);
  }

  const searchElements = [
    SearchBar('Destination', 'location'),
    Range('Date', 'min_date', 'max_date', 'From', 'To'),
    Slider('Price', 'min_price', 'max_price'),
  ];

  return (
    <div className="flex flex-col gap-3 w-90 h-fit p-3 bg-white shadow-lg rounded-lg">
      <div className="flex justify-end w-full h-fit">
        <Tooltip label="Clear search">
          <button
            onClick={searchNothing}
            className="rounded-lg shadow-black/20 bg-white p-1 hover:shadow-lg duration-150"
          >
            <CrossIcon size={17} strokeWidth={2.5} />
          </button>
        </Tooltip>
      </div>
      {searchElements.map((fn, index) => {
        return fn({ setFn: setSearchForField, index: index });
      })}
    </div>
  );
}
