import { NextURLSearchParams } from '@/app/types/URLs.types';
import Pay from '../controllers/PayController';

export default async function Page({
  searchParams,
}: {
  searchParams: NextURLSearchParams;
}) {
  return (
    <>
      <Pay searchParams={searchParams} />
    </>
  );
}
