import { PREMIUM_PLUS } from '@/app/consts/Bundles.json';
import BundleCard, { CardProps } from './BundleCard';

export default function PremiumPlus({
  basePrice,
  isBestSeller,
  flight,
  airplane,
  bookings,
  disabled,
  onClick,
}: CardProps) {
  const bestSeller = isBestSeller(PREMIUM_PLUS.NAME);

  return (
    <BundleCard
      title={
        <>
          <span>Premium </span>
          <span className="ml-3 text-5xl font-normal leading-none text-gg-green">
            +
          </span>
        </>
      }
      basePrice={basePrice}
      isBestSeller={bestSeller}
      onClick={onClick}
      bundleType="PREMIUM_PLUS"
      flight={flight}
      airplane={airplane}
      bookings={bookings}
      disabled={disabled}
    />
  );
}
