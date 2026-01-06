import { Box, Skeleton, Stack } from '@mantine/core';

export default function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Box>
        <Stack justify="center" align="center" m={20} style={{ height: '100%', width: '200px' }}>
          <Skeleton height={50} circle mb="xl" />
          <Skeleton height={8} mt={6} radius="xl" />
          <Skeleton height={8} mt={6} width='70%' radius="xl" />
          <Skeleton height={8} mt={6} width='40%' radius="xl" />
        </Stack>
      </Box>
    </div>
  );
}
