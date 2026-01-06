/**
 * @types RegistrationRecords, AccountRegistrationData
 * Types associated with Account Registration Data.
 *
 * @author Ethan Mahon (Candidate Number: 9093) | A2 Computer Science Coursework
 * @memberof AccountsApp
 */

import { AuthenticationAction } from '@/config/auth.config';
import React from 'react';

// This type defines what we might collect during registration
// each field is optional to allow initial empty states, but
// also in login the user may not provide all fields.
export type RegistrationRecords = {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
};

// This type defines the shape of the Context,
// so when we use React's native useContext, we have
// both types for the actual data we are collecting, and how
// we should set that data.
export type AccountRegistrationData = {
  registrationData: RegistrationRecords;
  setRegistrationData: React.Dispatch<
    React.SetStateAction<RegistrationRecords>
  >;
};

export type AccountRegistrationDataProviderProps = {
  authAction: AuthenticationAction;
  children: React.ReactNode;
  nextStep?: () => void;
  previousStep?: () => void;
  getStep?: () => { currentStep?: number; maxSteps?: number };
};
