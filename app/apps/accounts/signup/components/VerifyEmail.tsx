import { useEffect, useState, useRef } from 'react';
import LoadingEmail from './LoadingEmail';

export default function VerifyEmail({ challenge, objective }: { challenge: string, objective: string }) {
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
          `/api/accounts/verify-email?challenge=${challenge}&objective=${objective}`,
          {
            method: 'GET',
          }
        );
        console.log(response);
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

  return !fetched ? <LoadingEmail /> : (
    <LoadingEmail />
  );
}
