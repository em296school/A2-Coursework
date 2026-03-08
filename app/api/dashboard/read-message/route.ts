import Validator from '@/app/controllers/Validator/Validator';
import { Accounts } from '@/app/models/Accounts';
import { Inboxes, InboxProps } from '@/app/models/Inboxes';
import { generateMessageId } from '@/lib/inbox';
import { connectDB } from '@/lib/mongoose';
import { signIntoAccountWithCookie } from '@/lib/userAccount';

export async function POST(request: Request) {
  await connectDB();

  const { messageId }: { messageId: string } = await request.json();
  const account = await signIntoAccountWithCookie();

  if (!account) {
    return Response.json(
      {
        ok: false,
        message: 'Not logged in.',
      },
      {
        status: 401,
      }
    );
  }

  if (!messageId || (messageId && typeof messageId != 'string')) {
    return Response.json(
      {
        ok: false,
        message: 'Invalid message ID provided.',
      },
      {
        status: 400,
      }
    );
  }

  try {
    const messageUpdated = await Inboxes.findOneAndUpdate(
      {
        message_id: messageId,
        recipient_id: account.user_id,
      },
      {
        unread: false,
      }
    ).exec();

    if (!messageUpdated) {
      return Response.json(
        {
          ok: false,
          message: 'Unexpected error occurred.',
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        ok: true,
        message: 'Successfully read message.',
      },
      {
        status: 200,
      }
    );
  } catch {
    return Response.json(
      {
        ok: false,
        message: 'Unexpected error occurred.',
      },
      {
        status: 500,
      }
    );
  }
}
