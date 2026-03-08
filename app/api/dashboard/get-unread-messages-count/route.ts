import { Inboxes, InboxProps } from '@/app/models/Inboxes';
import { connectDB } from '@/lib/mongoose';
import { signIntoAccountWithCookie } from '@/lib/userAccount';

export async function GET(request: Request) {
  await connectDB();

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
  try {
    const count = await Inboxes.countDocuments({
      recipient_id: account.user_id,
      unread: true,
    }).exec();

    return Response.json(
      {
        count: count,
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
