import { rootDomain } from '@/config/constants';
import { notFound } from 'next/navigation';

interface Props {
    params: { subdomain: string };
}

export default function Accounts({ params }: Props) {
    const { subdomain } = params;

    return (
        <div>
            <h1>This is the dashboard for {subdomain}{rootDomain}</h1>
        </div>
    )
}