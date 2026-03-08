import Validator from '@/app/controllers/Validator/Validator';
import { formatToName } from '@/app/helpers/formatToName';
import { Accounts } from '@/app/models/Accounts';
import { Inboxes, InboxProps } from '@/app/models/Inboxes';
import { generateMessageId } from '@/lib/inbox';
import { connectDB } from '@/lib/mongoose';
import { signIntoAccountWithCookie } from '@/lib/userAccount';

export async function POST(request: Request) {
  await connectDB();

  const message: Record<string, string | number> = await request.json();
  const account = await signIntoAccountWithCookie();

  if (!account || (account && !account.is_staff)) {
    return Response.json(
      {
        ok: false,
        message: 'User is not authenticated.',
      },
      {
        status: 401,
      }
    );
  }

  // Validate the message
  const validator = new Validator(message);
  if (validator.validateInboxMessage()) {
    return Response.json(
      {
        ok: false,
        message: 'Inbox message is malformed.',
      },
      {
        status: 400,
      }
    );
  }

  if (!message.author) {
    message.author = formatToName(account.first_name);
  }

  const inboxMessage: InboxProps = {
    message_id: await generateMessageId(
      account.user_id,
      message.recipient_id as number
    ),
    message: {
      title: message.title as string,
      contents: message.contents as string,
    },
    author: message.author as string,
    timestamp: new Date().getTime(),
    unread: true,
    recipient_id: message.recipient_id as number,
  };

  // Check if the recipient actually exists
  const recipient = await Accounts.findOne({
    user_id: message.recipient_id,
  }).exec();

  if (!recipient) {
    return Response.json(
      {
        ok: false,
        message: 'Recipient does not exist.',
      },
      {
        status: 400,
      }
    );
  }

  // Send the message
  try {
    const sent = await new Inboxes(inboxMessage).save();

    if (!sent) {
      return Response.json(
        {
          ok: false,
          message: 'Could not send.',
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        ok: true,
        message: 'Sent inbox message.',
      },
      {
        status: 200,
      }
    );
  } catch {
    return Response.json(
      {
        ok: false,
        message: 'Could not send.',
      },
      {
        status: 500,
      }
    );
  }
}
