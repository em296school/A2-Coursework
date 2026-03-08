import { AccountProps } from '@/app/models/Accounts';
import { Inboxes, InboxProps } from '@/app/models/Inboxes';
import { signIntoAccountWithCookie } from '@/lib/userAccount';
import NoMessagesFound from './NoMessagesFound';
import { InboxIcon } from '../icons/InboxIcon';
import { InboxMessage } from './InboxMessage';
import { generateMessageId, sendInboxMessage } from '@/lib/inbox';

export default async function InboxDisplay() {
  const account: AccountProps | false = await signIntoAccountWithCookie();
  if (!account) return;

  try {
    // Get any messages
    let messages: InboxProps[] = await Inboxes.find({
      recipient_id: account.user_id,
    })
      .lean()
      .exec();

    if (messages.length < 1) {
      return <NoMessagesFound />;
    }

    // Sort based on how new the messages are
    messages = messages.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

    return (
      <div className="flex flex-col justify-center items-center w-full">
        <div className="flex flex-col p-2 w-[50%] max-h-200 bg-white shadow-sm border border-black/10 rounded-lg overflow-y-auto">
          <div className="flex flex-row gap-2 text-black/50 items-center">
            <InboxIcon size={17} strokeWidth={2} />
            <h2 className="font-medium">Inbox</h2>
          </div>
          {messages.map((message) => {
            delete message._id;
            return <InboxMessage {...message} />;
          })}
        </div>
      </div>
    );
  } catch {
    return <NoMessagesFound />;
  }
}
