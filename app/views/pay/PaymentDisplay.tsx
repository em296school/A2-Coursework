import { NextURLSearchParams } from '@/app/types/URLs.types';
import { ShoppingCartIcon } from '../icons/ShoppingCartIcon';
import { PaymentSubtotal } from './PaymentSubtotal';
import { BookingSubmission } from '@/app/models/Bookings';
import { FlightProps, Flights } from '@/app/models/Flights';
import PaymentErrorSubmission from './PaymentErrorSubmission';
import { AirplaneProps, Airplanes } from '@/app/models/Airplanes';
import { signIntoAccountWithCookie } from '@/lib/userAccount';
import { redirect } from 'next/navigation';
import { PaymentChoices } from './PaymentChoices';
import PaymentSubmit from './PaymentSubmit';
import PaymentSubmitted from './PaymentSubmitted';

export async function PaymentDisplay({
  searchParams,
}: {
  searchParams: NextURLSearchParams;
}) {
  let account = await signIntoAccountWithCookie();

  if (!account) {
    redirect('/login');
  }

  let { data, response } = await searchParams;

  if (response) {
    if (response == 'success') {
      return <PaymentSubmitted />;
    } else if (response == 'failure') {
      return <PaymentErrorSubmission />;
    }
  }

  let booking: BookingSubmission = JSON.parse(
    decodeURIComponent(data as string)
  );

  // Get the necessary details for cost calculation
  let flight: FlightProps | undefined;
  let airplane: AirplaneProps | undefined;
  try {
    flight = await Flights.findOne({ flight_id: booking.flight_id })
      .lean()
      .exec();

    if (!flight) {
      return <PaymentErrorSubmission />;
    }

    airplane = await Airplanes.findOne({ airplane_id: flight.airplane_id })
      .lean()
      .exec();

    if (!airplane) {
      return <PaymentErrorSubmission />;
    }

    delete flight._id;
    delete airplane._id;
  } catch {
    return <PaymentErrorSubmission />;
  }
  return (
    <div className="top-0 absolute h-screen w-screen">
      <div className="flex flex-row justify-center items-center h-screen">
        <div className="flex flex-col gap-8 justify-start items-center p-12 h-fit w-250 rounded-2xl shadow-xl">
          <div className="flex flex-row items-center gap-4 w-full">
            <ShoppingCartIcon size={40} strokeWidth={2.5} />
            <div className="flex flex-col gap-2">
              <h2 className="font-semibold text-4xl">Confirm your booking</h2>
            </div>
          </div>
          <PaymentSubtotal
            flight={flight}
            airplane={airplane}
            personPreferences={booking.person_options}
            essentialOptions={booking.booking_options}
          />
          <div className="flex flex-row gap-2 w-full px-2">
            <PaymentChoices
              personPreferences={booking.person_options}
              essentialOptions={booking.booking_options}
              airplane={airplane}
            />
            <PaymentSubmit booking={booking} />
          </div>
        </div>
      </div>
    </div>
  );
}
