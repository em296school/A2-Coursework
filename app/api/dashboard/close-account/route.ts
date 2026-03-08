import Validator from '@/app/controllers/Validator/Validator';
import { formatToName } from '@/app/helpers/formatToName';
import { AccountProps, Accounts } from '@/app/models/Accounts';
import { Bookings } from '@/app/models/Bookings';
import { Inboxes, InboxProps } from '@/app/models/Inboxes';
import { Sessions } from '@/app/models/Sessions';
import { generateMessageId } from '@/lib/inbox';
import { connectDB } from '@/lib/mongoose';
import { signIntoAccountWithCookie } from '@/lib/userAccount';

export async function POST(request: Request) {
  await connectDB();

  const req: { user_id: number } = await request.json();
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

  const id = req.user_id;
  // Check if the recipient actually exists
  const recipient: AccountProps = await Accounts.findOne({
    user_id: id,
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

  // Check if the account can be closed, for example
  // if only an admin can delete a staff account
  if ((recipient.is_staff && !account.is_admin) || recipient.is_admin) {
    return Response.json(
      {
        ok: false,
        message: 'Cannot delete this account.',
      },
      {
        status: 401,
      }
    );
  }

  // Delete the user account
  try {
    await Accounts.deleteOne({
      user_id: id,
    }).exec();

    // Delete all bookings & session tokens
    await Sessions.deleteOne({
      userId: id,
    }).exec();

    await Bookings.deleteMany({
      user_id: id,
    }).exec();

    return Response.json(
      {
        ok: true,
        message: 'Deleted user account.',
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
