'use client';

import { Button, Text, Stack } from '@mantine/core';
import { useState } from 'react';
import Loading from './loading';

export default function Home() {
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/test');
      const data = await res.json();
      setApiResponse(data.message);
    } catch (error) {
      setApiResponse(null);
    } finally {
      setLoading(false);
    }
  };
  return loading ? (
    <Loading />
  ) : (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Stack justify="center" align="center" style={{ height: '100%' }}>
        <div style={{ height: '30px', display: 'flex', alignItems: 'center' }}>
          <Text style={{ maxHeight: '30px' }}>
            {apiResponse ? JSON.stringify(apiResponse, null, 2) : 'No response.'}
          </Text>
        </div>
        <Button
          onClick={handleFetch}
          style={{
            width: '100px',
          }}
          loading={loading}
        >
          Fetch API
        </Button>
      </Stack>
    </div>
  );
}
