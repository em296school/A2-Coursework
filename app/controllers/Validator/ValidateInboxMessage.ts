import {
  MINIMUM_MESSAGE_LENGTH,
  MAXIMUM_MESSAGE_LENGTH,
} from '@/app/consts/DashboardSettings.json';

export default function ValidateInboxMessage(data: string | any) {
  if (!data || typeof data !== 'object') return false;

  const { title, contents, author, receipient_id } = data as Record<
    string,
    string
  >;
  if (!title || !contents || !author || !receipient_id) {
    return false;
  }

  if (
    typeof title !== 'string' ||
    typeof contents !== 'string' ||
    typeof author !== 'string' ||
    typeof receipient_id !== 'number'
  ) {
    return false;
  }

  if (title.length < 1 || title.length > 50) return false;
  if (
    contents.length < MINIMUM_MESSAGE_LENGTH ||
    contents.length > MAXIMUM_MESSAGE_LENGTH
  )
    return false;
  if (author.length < 3 || author.length > 25) return false;

  return true;
}
