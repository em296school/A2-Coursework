'use client';
import NavigationBar from './home/NavigationBar';
import IconButton from './utilities/buttons/IconButton';
import { UserIcon } from './icons/UserIcon';
import LogoPNG from '@/public/logo.png';

interface NavigatorProps {
  children?: React.ReactElement;
  isStaff?: boolean;
}
export default function Navigator({ children, isStaff }: NavigatorProps) {
  return (
    <NavigationBar>
      <NavigationBar.Emblem scale={25}>{LogoPNG}</NavigationBar.Emblem>
      <NavigationBar.Button clickPath="/about">About</NavigationBar.Button>
      <NavigationBar.Button clickPath="/account">Account</NavigationBar.Button>
      <NavigationBar.Button clickPath="/">Flights</NavigationBar.Button>
      {isStaff ? (
        <NavigationBar.Button clickPath="/staff">
          Staff Dashboard
        </NavigationBar.Button>
      ) : (
        <></>
      )}
      <NavigationBar.Docket>
        {children ? (
          <>{children}</>
        ) : (
          <>
            <a href="/login" rel="noreferrer">
              <IconButton icon={<UserIcon />} buttonStyle="secondary">
                Log in
              </IconButton>
            </a>
            <a href="/signup" rel="noreferrer">
              <IconButton
                icon={<UserIcon />}
                buttonStyle="primary"
                width="20px"
              >
                Sign up
              </IconButton>
            </a>
          </>
        )}
      </NavigationBar.Docket>
    </NavigationBar>
  );
}
