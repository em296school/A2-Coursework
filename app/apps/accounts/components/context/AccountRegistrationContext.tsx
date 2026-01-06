'use client';

/**
 * @context AccountRegistrationContext
 * Handles the Context provider and hook for Account Registration Data.
 *
 * @author Ethan Mahon (Candidate Number: 9093) | A2 Computer Science Coursework
 * @memberof AccountsApp
 */

import { createContext, useContext, useState } from 'react';
import { RegistrationRecords, AccountRegistrationData } from '../types/AccountRegistrationData';

// Create the context with default null value (because we have no registration data initially).
const AccountRegistrationContext = createContext<AccountRegistrationData | null>(null);

/**
 * @component AccountRegistrationProvider
 * This is our provider component which will wrap all the registration-related
 * components. It also initialises the registration data to a blank table.
 * 
 * @sourcef multiple channels
 * @param { children }: ...<Component />
 * @returns { children: React.ReactNode} Wrapped children components which have (if applicable) the onBlur handler applied.
 */
export function AccountRegistrationProvider({ children }: { children: React.ReactNode }) {
    const [registrationData, setRegistrationData] = useState<RegistrationRecords>({});
    return (
        <AccountRegistrationContext.Provider value={{ registrationData, setRegistrationData }}>
            {children}
        </AccountRegistrationContext.Provider>
    );
}

/**
 * @hook useAccountRegistration
 * This is how we'll actually get the data, and the function which sets the data.
 * We simply use React's native useContext hook to access our context, if
 * it doesn't exist we throw an error and then return the context if it does.
 * 
 * @sourcef many channels
 * @returns { registrationData: RegistrationRecords, setRegistrationData: AccountRegistrationData }
 */
export function useAccountRegistration() {
    const context = useContext(AccountRegistrationContext);
    if (!context) {
        throw new Error('useAccountRegistration must be used within an AccountRegistrationProvider');
    }
    return context;
}