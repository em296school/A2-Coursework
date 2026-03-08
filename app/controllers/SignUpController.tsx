import { connectDB } from '@/lib/mongoose';
import { redirect } from 'next/navigation';
import { signIntoAccountWithCookie } from '@/lib/userAccount';

import SignUpDisplay from '../views/signup/SignUpDisplay';

export default async function SignUpController() {
  await connectDB();

  const isSignedIn = await signIntoAccountWithCookie();
  if (isSignedIn) {
    redirect('/');
  }

  // The user has no account session so we can continue to sign up:
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen">
      <SignUpDisplay />
    </div>
  );
}
