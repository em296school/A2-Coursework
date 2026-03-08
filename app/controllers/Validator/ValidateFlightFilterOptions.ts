export default function ValidateFlightFilterOptions(data: string | any) {
  if (!data || typeof data !== 'object') return false;

  const { to, from, any } = data as Record<string, string[]>;
  if (!to || !from || !any) {
    return false;
  }

  if (
    typeof to !== 'object' ||
    typeof from !== 'object' ||
    typeof any !== 'object'
  ) {
    return false;
  }

  // This will also be true for arrays which
  // have no items because we don't always
  // query from: [], to: [],m etc
  if (
    !to.every((v) => typeof v == 'string') ||
    !from.every((v) => typeof v == 'string') ||
    !any.every((v) => typeof v == 'string')
  ) {
    return false;
  }

  return true;
}
