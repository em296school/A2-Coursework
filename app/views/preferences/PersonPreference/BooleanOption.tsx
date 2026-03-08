'use client';

import { Checkbox } from '@mantine/core';
import { useState } from 'react';

interface PreferencesBooleanOption {
  onChange?: (value: boolean) => void;
  children: string | React.ReactElement;
  disabled?: boolean;
}

export function BooleanOption({
  onChange,
  children,
  disabled,
}: PreferencesBooleanOption) {
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <Checkbox
      className="text-black/70"
      size="15px"
      label={children}
      checked={checked}
      onChange={(event) => {
        if (disabled) return;
        setChecked(event.currentTarget.checked);
        if (onChange) {
          onChange(event.currentTarget.checked);
        }
      }}
      disabled={disabled}
    />
  );
}
