'use client';
import React, { useState } from 'react';
import { EyeIcon } from '../icons/EyeIcon';
import { Tooltip } from '@mantine/core';

export interface FieldEntryProps {
  placeholder?: string;
  leftSvg?: React.ReactElement;
  title: string;
  isPassword?: boolean;
  isValidPredicate?: (text: string) => { hint?: string; isValid: boolean };
  submitFn?: (text: string) => void;
  disabled?: boolean;
}

export default function FieldEntry({
  placeholder,
  leftSvg,
  title,
  isPassword,
  isValidPredicate,
  submitFn,
  disabled,
}: FieldEntryProps) {
  let [textShowing, setTextShowing] = useState<boolean>(!isPassword);
  let [isValid, setIsValid] = useState<boolean>(true);
  let [hint, setHint] = useState<string>('');

  function textChanged(event: React.FormEvent<HTMLInputElement>) {
    if (submitFn) {
      submitFn(event.currentTarget.value);
    }
  }

  function focusLost(event: React.FocusEvent<HTMLInputElement, Element>) {
    if (isValidPredicate) {
      const { hint, isValid } = isValidPredicate(event.currentTarget.value);

      setIsValid(isValid);

      if (isValid) {
        setHint('');
        return;
      }

      if (hint) setHint(`*${hint}`);
    }
  }

  let textInput = (
    <div className="flex flex-row gap-2 w-full">
      <input
        placeholder={placeholder}
        className="outline-none placeholder-gray-300 w-full disabled:cursor-not-allowed"
        type={(!textShowing && 'password') || 'text'}
        onChange={(event) => textChanged(event)}
        onBlur={(event) => focusLost(event)}
        disabled={disabled}
      />
      {isPassword ? (
        <button
          className="group/showpass flex justify-self-end bg-white rounded-lg p-1 hover:shadow-md transition-all duration-300"
          onClick={() => setTextShowing(!textShowing)}
        >
          <EyeIcon
            className="stroke-black/20 stroke-[1.5px] group-hover/showpass:stroke-black/60 transition-all duration-300"
            size={17}
          />
        </button>
      ) : (
        <></>
      )}
    </div>
  );

  return (
    <>
      {disabled ? (
        <Tooltip
          label="This field is disabled"
          position="top-start"
          offset={-15}
        >
          <div className="flex flex-col justify-start h-22 opacity-40 hover:cursor-not-allowed">
            <h2 className="h-6 text-md pb-7 text-black/50">{title}</h2>
            <div className="group flex flex-row items-center border-current/20 gap-2 rounded-lg border px-2 w-84 h-9"></div>
            <h2 className="h-5 w-84 text-xs pt-1 text-red-400">{hint}</h2>
          </div>
        </Tooltip>
      ) : (
        <div
          className="flex flex-col justify-start h-22"
          style={{
            color: (isValid && 'black') || 'red',
          }}
        >
          <h2 className="h-6 text-md pb-7 text-black/50">{title}</h2>
          <div className="group flex flex-row items-center border-current/20 gap-2 rounded-lg border px-2 w-84 h-9 hover:border-current/60 transition-all duration-200">
            {leftSvg ? (
              <>
                {leftSvg}
                <div className="bg-current/20 w-px h-full group-hover:bg-current/60 transition-all duration-200" />
                {textInput}
              </>
            ) : (
              textInput
            )}
          </div>
          <h2 className="h-5 w-84 text-xs pt-1 text-red-400">{hint}</h2>
        </div>
      )}
    </>
  );
}
