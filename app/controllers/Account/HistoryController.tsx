import Navigator from '@/app/views/Navigator';
import { NextURLSearchParams } from '@/app/types/URLs.types';
import { connectDB } from '@/lib/mongoose';
import { signIntoAccountWithCookie } from '@/lib/userAccount';
import NavigationProfile from '@/app/views/home/Profile/NavigationProfile';
import { redirect } from 'next/navigation';
import HistoryDisplay from '@/app/views/history/HistoryDisplay';

export default async function HistoryController({
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
      <HistoryDisplay searchParams={searchParams} />
    </>
  );
}
