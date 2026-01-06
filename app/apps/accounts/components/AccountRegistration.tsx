'use client';

/**
 * @component AccountRegistration
 *
 * TODO: Rewrite this
 * The AccountRegistration component wraps all account registration related input fields
 * into a singleton context provider to manage shared state during the registration process.
 *
 * The application of the onChange handler is not recursive to avoid infinite rerendering loops,
 * so descendant components manually dispatch their data to the context onChange.
 *
 * The AccountRegistration component is used for both login and signup flows.
 *
 * @author Ethan Mahon (Candidate Number: 9093) | A2 Computer Science Coursework
 * @memberof AccountsApp
 */

import React from 'react';
import { useAccountRegistration } from '@/app/apps/accounts/components/context/AccountRegistrationContext';
import { UndefinedAuthenticationRequirement } from './types/AuthenticationRequirements';
import {
  AccountRegistrationData,
  AccountRegistrationDataProviderProps,
  RegistrationRecords,
} from './types/AccountRegistrationData';

import { AuthenticationAction, AuthenticationMap } from '@/config/auth.config';
import ContinueAuthenticationButton from './ContinueAuthenticationButton';

function clientConfirmsDataIsValid(
  authenticationRequirements: UndefinedAuthenticationRequirement,
  accountRegistrationData: RegistrationRecords
): boolean {
  // Verify that everything in `authenticationRequirements` exists in `accountRegistrationData`
  for (const key in authenticationRequirements) {
    if (
      !(key in accountRegistrationData) ||
      accountRegistrationData[key as keyof RegistrationRecords] === undefined
    ) {
      return false;
    }
  }

  // Verify that all requirements are met
  for (const key in authenticationRequirements) {
    const requirementCheck = authenticationRequirements[key];
    const dataValue = accountRegistrationData[key as keyof RegistrationRecords];

    if (!requirementCheck(dataValue as string)) {
      return false;
    }
  }

  return true;
}

/**
 * @function AccountRegistrationInner
 * Handles the core flow of the AccountRegistration component.
 *
 * @sourcef <AccountRegistration />
 * @param { children }: ...<Component />
 * @returns { children: React.ReactNode} Wrapped children components which have (if applicable) the onChange handler applied.
 */
function AccountRegistrationInner({
  authAction,
  children,
  nextStep,
  previousStep,
  getStep,
}: AccountRegistrationDataProviderProps) {
  const { registrationData } = useAccountRegistration();

  // Check if they have provided all required data for this auth action
  let authRequirements = AuthenticationMap[authAction];
  if (!authRequirements) {
    throw new Error(
      `No authentication requirements found for action: ${authAction}`
    );
  }

  // userCanContinueWithAuthentication
  let canContinue = clientConfirmsDataIsValid(
    authRequirements,
    registrationData
  );
  let nextStepText =
    authAction === 'signup'
      ? 'Continue'
      : authAction === 'login'
        ? 'Log In'
        : 'Continue';
  // Check if it is a multi-stepped registration process.
  const usesMultiStep = getStep !== undefined;
  if (usesMultiStep) {
    const { currentStep, maxSteps } = getStep();

    if (currentStep === maxSteps) {
      nextStepText = 'Complete';
    }

    // Return the wrapped children (because we need to display it).
    return (
      <>
        {children}
        <ContinueAuthenticationButton
          disabled={!canContinue}
          displayText={nextStepText}
          onClick={nextStep}
        />
      </>
    );
  } else {
    // Return the wrapped children (because we need to display it).
    return (
      <>
        {children}
        <ContinueAuthenticationButton
          disabled={!canContinue}
          displayText={nextStepText}
        />
      </>
    );
  }
}

/**
 * @component AccountRegistration
 * Passes the children into the AccountRegistrationInner component, then returns
 * this as this is just a wrapper component of the AccountRegistrationInner function.
 *
 * @sourcef multiple channels
 * @param { children }: ...<Component />
 * @returns { children: React.ReactNode} Wrapped children components which have (if applicable) the onBlur handler applied.
 */
export default function AccountRegistration({
  children: children,
  ...others
}: AccountRegistrationDataProviderProps) {
  return (
    <AccountRegistrationInner {...others}>
      {children}
    </AccountRegistrationInner>
  );
}
