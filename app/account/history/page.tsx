import { NextURLSearchParams } from '@/app/types/URLs.types';
import HistoryController from '@/app/controllers/Account/HistoryController';

export default async function Page({
  searchParams,
}: {
  searchParams: NextURLSearchParams;
}) {
  return <HistoryController searchParams={searchParams} />;
}
