import { BASIC } from '@/app/consts/Bundles.json';
import BundleCard, { CardProps } from './BundleCard';

export default function Basic({
  basePrice,
  isBestSeller,
  airplane,
  onClick,
  bookings,
  disabled,
  flight,
}: CardProps) {
  const bestSeller = isBestSeller(BASIC.NAME);

  return (
    <BundleCard
      title={
        <>
          <span>Basic</span>
        </>
      }
      basePrice={basePrice}
      isBestSeller={bestSeller}
      onClick={onClick}
      bundleType="BASIC"
      flight={flight}
      airplane={airplane}
      bookings={bookings}
      disabled={disabled}
    />
  );
}
