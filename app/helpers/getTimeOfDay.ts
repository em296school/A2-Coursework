type TimePeriod = 'morning' | 'afternoon' | 'evening';
export function getTimeOfDay(date?: Date): TimePeriod {
  let time = (date || new Date()).getHours();

  if (time > 5 && time <= 11) {
    return 'morning';
  } else if (time >= 12 && time <= 17) {
    return 'afternoon';
  } else {
    return 'evening';
  }
}
