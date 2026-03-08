export function getDaysHoursDelta(date: Date) {
  const deltaMiliseconds = Math.abs(Date.now() - date.getTime());
  const deltaHours = deltaMiliseconds / 1000 / 60 / 60;

  let suffix = '';
  let divisor = 1;

  if (deltaHours / 24 < 1) {
    suffix = 'hour';
  } else {
    divisor = 24;
    suffix = 'day';
  }

  const n = Math.floor(deltaHours / divisor);
  return `${n} ${suffix}${n > 1 ? 's' : ''}`;
}
