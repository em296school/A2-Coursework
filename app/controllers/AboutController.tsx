import Navigator from '../views/Navigator';
import { connectDB } from '@/lib/mongoose';
import { signIntoAccountWithCookie } from '@/lib/userAccount';
import NavigationProfile from '../views/home/Profile/NavigationProfile';
import AboutDisplay from '../views/about/AboutDisplay';

export default async function About() {
  await connectDB();
  const account = await signIntoAccountWithCookie();

  return (
    <>
      {account ? (
        <Navigator isStaff={account.is_staff}>
          <NavigationProfile
            first_name={account.first_name}
            last_name={account.last_name}
            is_staff={account.is_staff}
            is_admin={account.is_admin}
          />
        </Navigator>
      ) : (
        <Navigator />
      )}
      <AboutDisplay />
    </>
  );
}
