import Bundles from '@/app/consts/Bundles.json';

export function getAdditionalCost(option: string, value?: string): number {
  const costs: Record<string, number> = Bundles.COSTS;

  // Calculate seat_groups:
  if (!costs[option] && value) {
    if (typeof costs[value] == 'number') {
      return costs[value];
    }

    throw new Error(`Seating group option ${value} does not exist.`);
  }

  if (costs[option]) {
    return costs[option];
  }

  throw new Error(`Additional cost option ${option} does not exist.`);
}
