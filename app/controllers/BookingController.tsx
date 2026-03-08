import Navigator from '../views/Navigator';
import { connectDB } from '@/lib/mongoose';
import { Flights } from '../models/Flights';
import { NextURLSearchParams } from '@/app/types/URLs.types';

import { signIntoAccountWithCookie } from '@/lib/userAccount';
import NavigationProfile from '../views/home/Profile/NavigationProfile';
import { redirect } from 'next/navigation';
import BookingDisplay from '../views/booking/BookingDisplay';

export default async function Booking({
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
      <BookingDisplay searchParams={searchParams} />
    </>
  );
}
