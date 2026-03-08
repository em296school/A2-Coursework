import Image from 'next/image';
import LogoPNG from '@/public/logo-primary-color.png';

export default function GreenGlideLogo({ scale }: { scale?: string }) {
  return (
    <div
      className="select-none flex flex-row items-center gap-4"
      style={{
        scale: scale || '100%',
      }}
    >
      <Image
        src={LogoPNG}
        alt="GreenGlide"
        width={40}
        height={40}
        className="color-"
      />
      <h2 className="text-gg-green text-4xl font-bold font-gg-title">
        GreenGlide
      </h2>
    </div>
  );
}
