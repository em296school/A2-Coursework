import mongoose from 'mongoose';
import Navigator from '../views/Navigator';
import { connectDB } from '@/lib/mongoose';
import { Accounts } from '../models/Accounts';

export default async function Home() {
  await connectDB();

  let doc = new Accounts({
    user_id: '1',
    first_name: 'John',
    last_name: 'Cena',
    email: 'johncena@gmail.com',
    password: 'not_secure',
    telephone: '0755',
  });

  console.log('trying to sdave');
  doc
    .save()
    .then(() => {
      console.log('SAVED');
    })
    .catch(() => {
      console.log('smth wnet wrong');
    });

  return (
    <>
      <Navigator signedIn={false} />
      <h1 className="text-9xl">Hi</h1>
      <h1 className="text-9xl">Hi</h1>
      <h1 className="text-9xl">Hi</h1>
      <h1 className="text-9xl">Hi</h1>
      <h1 className="text-9xl">Hi</h1>
      <h1 className="text-9xl">Hi</h1>
      <h1 className="text-9xl">Hi</h1>
      <h1 className="text-9xl">Hi</h1>
      <h1 className="text-9xl">Hi</h1>
      <h1 className="text-9xl">Hi</h1>
      <h1 className="text-9xl">Hi</h1>
    </>
  );
}
