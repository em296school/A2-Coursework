import { useEffect, useState, useRef } from 'react';

export default function VerifyEmail({ challenge }: { challenge: string }) {
  const [fetched, setFetchState] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) {
      return;
    }
    hasFetchedRef.current = true;

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `/api/accounts/verify-email?challenge=${challenge}`,
          {
            method: 'GET',
          }
        );
      } catch (error) {
        setError('An error occurred while verifying your email.');
      } finally {
        setFetchState(true);
      }
    };

    if (!fetched) {
      verifyEmail();
    }
  }, [challenge, fetched]);

  return (
    <div>{(fetched && <p>Fetched!</p>) || <p>Verifying your email...</p>}</div>
  );
}
