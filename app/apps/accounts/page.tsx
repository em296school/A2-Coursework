import { RootDomain } from '@/config/constants';
import { redirect } from 'next/navigation';

interface Props {
  params: { subdomain: string };
}

export default function Accounts({ params }: Props) {
  const { subdomain } = params;

  if (true) {
    redirect('/apps/accounts/login');
  }
  return (
    <div>
      <h1>
        This is the dashboard for {subdomain}
        {RootDomain}
      </h1>
    </div>
  );
}
