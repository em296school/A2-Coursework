'use client';

import { useState } from 'react';

interface PreferencesStringOption {
  onChange?: (text: string) => void;
  placeholder?: string;
  id: string;
  children: string;
}

export function StringOption({
  onChange,
  placeholder,
  id,
  children,
}: PreferencesStringOption) {
  return (
    <div className="flex flex-col h-15 w-full">
      <h2 className="text-md text-black/50">{children}</h2>
      <input
        id={id}
        className="w-full h-full outline-none placeholder-gray-300 border-b border-b-black/50"
        placeholder={placeholder}
        onChange={(e) => {
          if (onChange) {
            onChange(e.currentTarget.value);
          }
        }}
      />
    </div>
  );
}
