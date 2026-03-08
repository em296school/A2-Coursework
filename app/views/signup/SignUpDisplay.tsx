import GreenGlideLogo from '../GreenGlideLogo';
import SignUpForm from './SignUpForm';

export default function SignUpDisplay() {
  return (
    <div className="flex flex-col justify-center items-center gap-2 w-120 py-10 px-15 rounded-2xl shadow-xl">
      <GreenGlideLogo />
      <div className="mt-16">
        <SignUpForm />
      </div>
    </div>
  );
}
