import { Inboxes, InboxProps } from '@/app/models/Inboxes';

export async function sendInboxMessage(
  recipientId: number,
  message: Omit<InboxProps, 'recipient_id'>
): Promise<boolean | undefined> {
  const inboxMessage: InboxProps = {
    ...message,
    recipient_id: recipientId,
  };

  try {
    const sent = await new Inboxes(inboxMessage).save();
    if (!sent) {
      throw new Error('Failed to send message.');
    }

    return true;
  } catch {
    throw new Error('Failed to send message.');
  }
}

export async function generateMessageId(
  sender_id: number,
  recipient_id: number
) {
  let count = await Inboxes.countDocuments().exec();
  let timestamp = new Date().getTime().toString();

  return `${count}${timestamp}-${sender_id}${recipient_id}`;
}
