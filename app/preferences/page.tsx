import { NextURLSearchParams } from '@/app/types/URLs.types';
import Preferences from '../controllers/PreferencesController';

export default async function Page({
  searchParams,
}: {
  searchParams: NextURLSearchParams;
}) {
  return (
    <>
      <Preferences searchParams={searchParams} />
    </>
  );
}
