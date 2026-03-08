import Validator from '@/app/controllers/Validator/Validator';
import { AccountProps, Accounts } from '@/app/models/Accounts';
import { AccountUpdateProps } from '@/app/types/Accounts.types';
import { generateMessageId, sendInboxMessage } from '@/lib/inbox';
import { connectDB } from '@/lib/mongoose';
import { hashPassword, signIntoAccountWithCookie } from '@/lib/userAccount';

function createChangeReport(changelog: string[]) {
  return `${changelog.length > 1 ? 'Several settings' : 'One setting'} on your account has been changed, this includes: ${changelog.toString()}. If you do not recognise these changes, please file a report in your report centre in your account settings!`;
}

export async function POST(request: Request) {
  await connectDB();

  const edits: AccountUpdateProps = await request.json();
  const validator = new Validator(edits);

  // Check that this data can be validated.
  if (!validator.validateAccountUpdate()) {
    return Response.json(
      {
        ok: false,
        message: 'Invalid data sent to account update.',
      },
      {
        status: 400,
      }
    );
  }

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

  // If we are selfUpdating, then the ID must match our session's ID:
  if (edits.isSelfSubmit && account.user_id !== edits.targetId) {
    return Response.json(
      {
        ok: false,
        message: 'User ID mismatch.',
      },
      {
        status: 401,
      }
    );
  }

  const targetAccount: AccountProps = await Accounts.findOne({
    user_id: edits.targetId,
  }).exec();

  if (!targetAccount) {
    return Response.json(
      {
        ok: false,
        message: 'Target account does not exist.',
      },
      {
        status: 400,
      }
    );
  }

  // If we are a staff member updating, the target user cannot be a fellow
  // staff and we must be staff ourself
  if (!edits.isSelfSubmit && (targetAccount.is_staff || !account.is_staff)) {
    return Response.json(
      {
        ok: false,
        message: 'Unauthenticated action.',
      },
      {
        status: 401,
      }
    );
  }

  // Get what settings are actually being changed
  let changelog = [];

  // Create the update
  let { email, password, requires_assistance, wheelchair } = edits;
  let updateQuery: Record<string, string | boolean> = {
    requires_assistance: requires_assistance,
    wheelchair: wheelchair,
  };

  if (email.length > 0) {
    changelog.push('Email');
    updateQuery['email'] = email;
  }

  if (password.length > 0) {
    changelog.push('Password');
    updateQuery['passwordHash'] = await hashPassword(password);
  }

  if (requires_assistance !== targetAccount.requires_assistance) {
    changelog.push('Requires assistance');
  }

  if (wheelchair !== targetAccount.wheelchair) {
    changelog.push('Wheelchair usage');
  }

  // We can now apply the changes
  try {
    const success = await Accounts.updateOne(
      {
        user_id: targetAccount.user_id,
      },
      updateQuery
    ).exec();

    if (!success) {
      return Response.json(
        {
          ok: false,
          message: 'Could not update account at this time.',
        },
        {
          status: 500,
        }
      );
    }

    // Let the user know this change happened:
    await sendInboxMessage(targetAccount.user_id, {
      author: 'system',
      message_id: await generateMessageId(0, targetAccount.user_id),
      timestamp: new Date().getTime(),
      unread: true,
      message: {
        title: 'Your account has been updated!',
        contents: createChangeReport(changelog),
      },
    });

    return Response.json(
      {
        ok: true,
        message: 'Successfully updated account.',
      },
      {
        status: 200,
      }
    );
  } catch {
    return Response.json(
      {
        ok: false,
        message: 'Could not update account at this time.',
      },
      {
        status: 500,
      }
    );
  }
}
