export function getTimeAsAMPM(date: Date) {
  let hours = date.getHours().toString();
  let minutes = date.getMinutes().toString();
  let suffix = Number(hours) < 12 ? 'AM' : 'PM';

  if (Number(minutes) < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes} ${suffix}`;
}
