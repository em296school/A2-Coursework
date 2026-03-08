import {
  MINIMUM_MESSAGE_LENGTH,
  MAXIMUM_MESSAGE_LENGTH,
} from '@/app/consts/DashboardSettings.json';

export default function ValidateSupportQuery(data: object | any) {
  if (!data || typeof data !== 'object') return false;

  const { contents } = data as Record<string, string>;
  if (!contents) {
    return false;
  }

  if (typeof contents !== 'string') {
    return false;
  }

  if (
    contents.length < MINIMUM_MESSAGE_LENGTH ||
    contents.length > MAXIMUM_MESSAGE_LENGTH
  ) {
    return false;
  }

  return true;
}
