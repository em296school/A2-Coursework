'use client';

import React, { use } from 'react';
import { useAccountRegistration } from './context/AccountRegistrationContext';

export default function AuthenticationWrapper({
  usesCustomSetState,
  children,
}: {
  usesCustomSetState?: boolean;
  children: React.ReactNode;
}) {
  const { setRegistrationData } = useAccountRegistration();

  const handleRegistrationDataSubmission = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setRegistrationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const wrappedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      let elementAttributes = usesCustomSetState
        ? {
            onInput: handleRegistrationDataSubmission,
          }
        : {
            onChange: handleRegistrationDataSubmission,
          };
      return React.cloneElement(child, elementAttributes as any);
    }
    return child;
  });

  return <>{wrappedChildren}</>;
}
