import { LockIcon } from '../icons/LockIcon';

export default function NoAccessStaffPage() {
  return (
    <div className="flex flex-row justify-center items-center w-full h-[50vh] gap-4">
      <LockIcon size={50} strokeWidth={2.5} />
      <div className="flex flex-col">
        <h2 className="font-medium text-2xl">No access</h2>
        <h2 className="font-normal text-lg text-black/50">
          You do not have access to this page.
        </h2>
      </div>
    </div>
  );
}
