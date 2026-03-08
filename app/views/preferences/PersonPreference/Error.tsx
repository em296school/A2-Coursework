'use client';

import { Checkbox } from '@mantine/core';
import { useState } from 'react';

interface PreferencesError {
  children: string;
}

export function Error({ children }: PreferencesError) {
  return <div className="text-md text-red-600 h-5 w-full">{children}</div>;
}
