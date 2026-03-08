import { BundleTypes, UnevaluatedPreferences } from '../models/Bookings';
import Bundles from '@/app/consts/Bundles.json';

export function getBundlePreset(name: BundleTypes) {
  return Bundles[name].PRE_SET as UnevaluatedPreferences;
}
