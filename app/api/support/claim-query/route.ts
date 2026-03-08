import Validator from '@/app/controllers/Validator/Validator';
import { SupportQueries, SupportQueryProps } from '@/app/models/SupportQueries';
import { generateMessageId } from '@/lib/inbox';
import { connectDB } from '@/lib/mongoose';
import { signIntoAccountWithCookie } from '@/lib/userAccount';

export async function POST(request: Request) {
  await connectDB();

  const req: Record<string, string> = await request.json();
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

  const { messageId } = req;

  if (!messageId || (messageId && typeof messageId !== 'string')) {
    return Response.json(
      {
        ok: false,
        message: 'Invalid message ID.',
      },
      {
        status: 400,
      }
    );
  }

  // Try and find it, and if so update it to claimed status
  try {
    const claimed = await SupportQueries.findOneAndUpdate(
      {
        message_id: messageId,
      },
      {
        claimed_id: account.user_id,
      }
    ).exec();

    if (!claimed) {
      return Response.json(
        {
          ok: false,
          message: 'Could not claim.',
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        ok: true,
        message: 'Claimed support query.',
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
