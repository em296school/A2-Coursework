'use client';

/**
 * @type Page
 * Page which renders the login form for the Accounts application.
 *
 * @author Ethan Mahon (Candidate Number: 9093) | A2 Computer Science Coursework
 * @memberof AccountsApp
 */

import {
  Group,
  Title,
  Stack,
  Divider,
  Checkbox,
  Anchor,
  Box,
  Stepper,
} from '@mantine/core';

import NavBar from '@/app/components/NavBar';
import CredentialForm from './components/CredentialForm';
import styles from './page.module.css';
import ProfileForm from './components/ProfileForm';
import SectionDivider from '@/app/components/SectionDivider';
import AccountRegistration from '../components/AccountRegistration';
import React from 'react';

import { IconLock, IconUser } from '@tabler/icons-react';
import { AccountRegistrationProvider } from '../components/context/AccountRegistrationContext';
import VerifyEmail from './components/VerifyEmail';

// Export the Login page component
// todo: prefers-reduced-motion
export default function Login() {
  const maxSteps = 3;
  const [signUpStep, setSignUpStep] = React.useState(1);

  const nextStep = () => {
    signUpStep < maxSteps && setSignUpStep(signUpStep + 1);
  };
  const previousStep = () => {
    signUpStep > 1 && setSignUpStep(signUpStep - 1);
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          paddingBottom: '5rem',
          paddingTop: '5rem',
        }}
      >
        <Stepper active={signUpStep-1} allowNextStepsSelect={false} style={{padding: '2rem',}}>
          <Stepper.Step label="First step" description="First step">
            <Stack p={{ base: 'sm', sm: 'md', md: 'xl' }} className={styles.group}>
              <Title order={2} style={{ textShadow: 'var(--text-shadow)' }}>
                Welcome
              </Title>

              <AccountRegistrationProvider>
                <AccountRegistration
                  authAction="signup"
                  nextStep={nextStep}
                  previousStep={previousStep}
                  getStep={() => {
                    return { currentStep: signUpStep, maxSteps: maxSteps };
                  }}
                >
                  <SectionDivider icon={<IconUser size={12} />}>
                    Create your profile
                  </SectionDivider>

                  <ProfileForm />

                  <SectionDivider icon={<IconLock size={12} />}>
                    Set up your credentials
                  </SectionDivider>

                  <CredentialForm />
                  <Checkbox
                    disabled
                    indeterminate
                    label={
                      <>
                        I agree to the{' '}
                        <Anchor
                          href="/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          privacy policy
                        </Anchor>
                        .
                      </>
                    }
                  />
                </AccountRegistration>
              </AccountRegistrationProvider>
            </Stack>
          </Stepper.Step>
          <Stepper.Step label="Final step" description="Final step">
            <VerifyEmail challenge="sample-challenge-token" />
          </Stepper.Step>
          <Stepper.Step label="Final step" description="Final step">
            <div>PASSED SIGNUP</div>
          </Stepper.Step>
        </Stepper>
      </div>
    </div>
  );
}
