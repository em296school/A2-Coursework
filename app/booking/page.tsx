import Booking from '../controllers/BookingController';
import { NextURLSearchParams } from '@/app/types/URLs.types';

export default async function Page({
  searchParams,
}: {
  searchParams: NextURLSearchParams;
}) {
  return (
    <>
      <Booking searchParams={searchParams} />
    </>
  );
}
