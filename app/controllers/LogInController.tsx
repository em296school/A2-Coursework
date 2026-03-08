import { connectDB } from '@/lib/mongoose';
import { redirect } from 'next/navigation';
import { signIntoAccountWithCookie } from '@/lib/userAccount';

import LogInDisplay from '../views/login/LogInDisplay';

export default async function LogInController() {
  await connectDB();

  const isSignedIn = await signIntoAccountWithCookie();
  if (isSignedIn) {
    redirect('/');
  }

  // The user has no account session so we continue to login:
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen">
      <LogInDisplay />
    </div>
  );
}
