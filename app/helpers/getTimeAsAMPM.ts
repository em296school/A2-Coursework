export function getTimeAsAMPM(date: Date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let suffix = hours < 12 ? 'AM' : 'PM';

  return `${hours}:${minutes} ${suffix}`;
}
