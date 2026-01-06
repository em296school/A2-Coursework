import { Skeleton, Stack } from '@mantine/core';

export default function LoadingEmail() {
  return (
    <Stack justify="center" align="center">
      <Skeleton height={50} circle mb="xl" />
      <Skeleton height={8} width="70%" radius="xl" />
      <Skeleton height={8} mt={6} width="50%" radius="xl" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
    </Stack>
  );
}
