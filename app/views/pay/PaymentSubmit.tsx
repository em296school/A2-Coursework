'use client';
import { BookingSubmission } from '@/app/models/Bookings';
import { AlertIcon } from '../icons/AlertIcon';
import { useState } from 'react';
import PaymentErrorSubmission from './PaymentErrorSubmission';
import PaymentSubmitted from './PaymentSubmitted';
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation';

export default function PaymentSubmit({
  booking,
}: {
  booking: BookingSubmission;
}) {
  const router = useRouter();

  // These two variables do the same thing- we just have a `let` because
  // React state can be deferred slightly
  const [sentBooking, setSentBooking] = useState<boolean>(false);
  let bookingProcessed = false;

  async function submit() {
    if (sentBooking || bookingProcessed) return;

    bookingProcessed = true;
    setSentBooking(true);

    if (booking.bundleType) {
      booking.isBundle = true;
    }

    try {
      const response = await fetch('/api/bookings/make-booking', {
        body: JSON.stringify(booking),
        method: 'POST',
      });

      if (!response) {
        router.push('/pay?response=failure');
        return;
      }

      const result = await response.json();
      console.log(result);

      if (!result.ok) {
        router.push('/pay?response=failure');
        return;
      }

      router.push('/pay?response=success');
    } catch (err: Error | any) {
      console.log(err.message);
      router.push('/pay?response=failure');
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full px-4 text-lg text-black/50">
      <span>Are you ready to submit your booking?</span>
      <div className="flex flex-col">
        <div className="flex flex-row gap-1 text-md text-black/30 items-center">
          <AlertIcon size={13} strokeWidth={2} />
          Have you checked all your options?
        </div>
        <div className="flex flex-row gap-1 text-md text-black/30 items-center">
          <AlertIcon size={13} strokeWidth={2} />
          You can cancel up to 2 days before departure
        </div>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <button
          onClick={submit}
          className="flex justify-center items-center bg-black/40 text-white text-xl py-2.5 px-8 shadow-lg rounded-xl hover:bg-gg-green hover:mb-0.5 transition-all duration-150"
        >
          <h2 className="font-semibold">Submit</h2>
        </button>
        <a
          href={`/preferences?id=${booking.flight_id.toString()}`}
          rel="noreferrer"
          className="text-[16px] text-black/50 font-medium hover:text-black"
        >
          Go back to preferences
        </a>
      </div>
    </div>
  );
}
