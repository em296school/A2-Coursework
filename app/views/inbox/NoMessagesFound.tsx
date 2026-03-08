import { HomeIcon } from '@/app/views/icons/HomeIcon';
import { MagnifyingGlassIcon } from '@/app/views/icons/MagnifyingGlassIcon';
import IconButton from '@/app/views/utilities/buttons/IconButton';

export default function NoMessagesFound() {
  return (
    <div className="top-0 absolute h-screen w-screen">
      <div className="flex flex-row gap-10 justify-center items-center h-screen">
        <MagnifyingGlassIcon size={70} strokeWidth={2.5} />
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-5xl text-black">No messages</h2>
          <h2 className="font-normal text-2xl text-black/60">
            You have no messages at this time.
          </h2>
          <div className="flex flex-row gap-2 mt-2">
            <a href="/" rel="noreferrer">
              <IconButton icon={<HomeIcon />} buttonStyle="secondary">
                Go home
              </IconButton>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
