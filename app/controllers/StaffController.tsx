import { connectDB } from '@/lib/mongoose';
import { signIntoAccountWithCookie } from '@/lib/userAccount';
import { redirect } from 'next/navigation';

import Navigator from '../views/Navigator';
import NavigationProfile from '../views/home/Profile/NavigationProfile';
import StaffDashboard from '../views/staff/StaffDashboard';
import NoAccessStaffPage from '../views/staff/NoAccessStaffPage';

export default async function StaffController() {
  await connectDB();

  const account = await signIntoAccountWithCookie();
  if (!account) {
    redirect('/login');
  }

  const isStaff = account.is_staff;
  return (
    <>
      <Navigator isStaff={isStaff}>
        <NavigationProfile
          first_name={account.first_name}
          last_name={account.last_name}
          is_staff={account.is_staff}
          is_admin={account.is_admin}
        />
      </Navigator>
      {isStaff ? (
        <StaffDashboard is_admin={account.is_admin} />
      ) : (
        <NoAccessStaffPage />
      )}
    </>
  );
}
