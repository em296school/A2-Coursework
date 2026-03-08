import { MESSAGE } from '@/app/consts/AboutSettings.json';

export default function AboutDisplay() {
  return (
    <div className="flex flex-col justify-start items-center h-100 w-full">
      <div className="flex flex-col justify-start w-[50%]">
        <h2 className="text-2xl font-bold">Welcome to GreenGlide!</h2>
        <span className="text-sm text-black/50">1 minute read</span>
        <br />
        <span className="text-md text-black/75">{MESSAGE}</span>
      </div>
    </div>
  );
}
