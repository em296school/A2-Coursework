import { HomeIcon } from '../icons/HomeIcon';
import { UserIcon } from '../icons/UserIcon';
import IconButton from '../utilities/buttons/IconButton';

export default function NotSignedIn() {
  return (
    <div className="top-0 absolute h-screen w-screen">
      <div className="flex flex-row gap-10 justify-center items-center h-screen">
        <UserIcon size={70} strokeWidth={2.5} />
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-5xl text-black">Sorry</h2>
          <h2 className="font-normal text-2xl text-black/60">
            You must be signed in to continue.
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
