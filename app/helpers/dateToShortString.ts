import { getOrdinal } from './getOrdinal';

export function dateToShortString(date: Date): string {
  let month = date.toLocaleString('en-GB', { month: 'long' });
  let day = date.getDate();
  let daySuffix = getOrdinal(day);

  return `${day}${daySuffix} ${month}`;
}
