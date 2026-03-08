import {
  MINIMUM_MESSAGE_LENGTH,
  MAXIMUM_MESSAGE_LENGTH,
} from '@/app/consts/DashboardSettings.json';

export default function ValidateSendMessage(data: string | any) {
  if (!data || typeof data !== 'string') return false;

  const text = <string>data;

  // Check if the password looks fine:
  return (
    text.length >= MINIMUM_MESSAGE_LENGTH &&
    text.length <= MAXIMUM_MESSAGE_LENGTH
  );
}
