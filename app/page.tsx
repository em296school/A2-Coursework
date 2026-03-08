import { NextURLSearchParams } from './types/URLs.types';
import Home from './controllers/HomeController';
export default async function Page({
  searchParams,
}: {
  searchParams: NextURLSearchParams;
}) {
  return (
    <>
      <Home searchParams={searchParams} />
    </>
  );
}
