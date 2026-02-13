'use client';
import NavigationBar from './home/NavigationBar';
import IconButton from './utilities/buttons/IconButton';
import { UserIcon } from './icons/UserIcon';
import LogoPNG from '@/public/logo.png';

interface NavigatorProps {
  signedIn: boolean;
}
export default function Navigator({ signedIn }: NavigatorProps) {
  return (
    <NavigationBar user_is_signedIn={signedIn}>
      <NavigationBar.Emblem scale={25}>{LogoPNG}</NavigationBar.Emblem>
      <NavigationBar.Button clickPath="/">About</NavigationBar.Button>
      <NavigationBar.Button clickPath="/">Account</NavigationBar.Button>
      <NavigationBar.Button clickPath="/">Inbox</NavigationBar.Button>
      <NavigationBar.Button clickPath="/">Flights</NavigationBar.Button>
      <NavigationBar.Docket>
        <IconButton icon={<UserIcon />} buttonStyle="secondary">
          Log in
        </IconButton>
        <IconButton icon={<UserIcon />} buttonStyle="primary" width="20px">
          Sign up
        </IconButton>
      </NavigationBar.Docket>
    </NavigationBar>
  );
}
