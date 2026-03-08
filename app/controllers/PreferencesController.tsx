import Navigator from '../views/Navigator';
import { connectDB } from '@/lib/mongoose';
import { NextURLSearchParams } from '@/app/types/URLs.types';

import { signIntoAccountWithCookie } from '@/lib/userAccount';
import NavigationProfile from '../views/home/Profile/NavigationProfile';
import { redirect } from 'next/navigation';
import PreferencesDisplay from '../views/preferences/PreferencesDisplay';

export default async function Preferences({
  searchParams,
}: {
  searchParams: NextURLSearchParams;
}) {
  await connectDB();

  const account = await signIntoAccountWithCookie();
  if (!account) {
    redirect('/login');
  }

  return (
    <>
      <Navigator isStaff={account.is_staff}>
        <NavigationProfile
          first_name={account.first_name}
          last_name={account.last_name}
          is_staff={account.is_staff}
          is_admin={account.is_admin}
        />
      </Navigator>
      <PreferencesDisplay searchParams={searchParams} />
    </>
  );
}
