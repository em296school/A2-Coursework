import { PREMIUM } from '@/app/consts/Bundles.json';
import BundleCard, { CardProps } from './BundleCard';

export default function Premium({
  basePrice,
  isBestSeller,
  flight,
  airplane,
  bookings,
  disabled,
  onClick,
}: CardProps) {
  const bestSeller = isBestSeller(PREMIUM.NAME);

  return (
    <BundleCard
      title={
        <>
          <span>Premium</span>
        </>
      }
      basePrice={basePrice}
      isBestSeller={bestSeller}
      onClick={onClick}
      bundleType="PREMIUM"
      flight={flight}
      airplane={airplane}
      bookings={bookings}
      disabled={disabled}
    />
  );
}
