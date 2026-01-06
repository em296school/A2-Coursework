'use client';

import { useState } from 'react';

export default async function VerifyEmail({ challenge }: { challenge: string }) {
    const [fetched, setFetchState] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const verifyEmail = async () => {
        try {
            const response = await fetch(`/api/accounts/verify-email?challenge=${challenge}`, {
                method: 'GET',
            });
        } catch (error) {
            setError('An error occurred while verifying your email.');
        } finally {
            setFetchState(true);
        }
    }

    await verifyEmail();

    return (
        <div>
            Has fetched:  {fetched ? 'Yes' : 'No'}
            {error && <p>Error: {error}</p>}
        </div>
    )
}