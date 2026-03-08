import Validator from '@/app/controllers/Validator/Validator';
import { SupportQueries, SupportQueryProps } from '@/app/models/SupportQueries';
import { generateMessageId } from '@/lib/inbox';
import { connectDB } from '@/lib/mongoose';
import { signIntoAccountWithCookie } from '@/lib/userAccount';

export async function POST(request: Request) {
  await connectDB();

  const req: Record<string, string> = await request.json();
  const account = await signIntoAccountWithCookie();

  if (!account) {
    return Response.json(
      {
        ok: false,
        message: 'User is not logged in.',
      },
      {
        status: 401,
      }
    );
  }

  // Validate the message
  const validator = new Validator(req);
  if (!validator.validateSupportQuery()) {
    return Response.json(
      {
        ok: false,
        message: 'Support query message is malformed.',
      },
      {
        status: 400,
      }
    );
  }

  const { contents } = req;

  const queryMessage: SupportQueryProps = {
    message_id: await generateMessageId(account.user_id, 0),
    message: {
      contents: contents,
    },
    author_id: account.user_id,
    timestamp: new Date().getTime(),
  };

  // Send the message
  try {
    const sent = await new SupportQueries(queryMessage).save();

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
        message: 'Sent support query.',
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
