import { AccountProps, Accounts } from '@/app/models/Accounts';
import { FoundUserProps } from '@/app/types/Accounts.types';
import { connectDB } from '@/lib/mongoose';
import { signIntoAccountWithCookie } from '@/lib/userAccount';

export async function POST(request: Request) {
  await connectDB();

  const req: Record<string, number> = await request.json();
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

  if (!req.userId || (req.userId && typeof req.userId !== 'number')) {
    return Response.json(
      {
        ok: false,
        message: 'Invalid user ID.',
      },
      {
        status: 400,
      }
    );
  }

  try {
    const user: AccountProps = await Accounts.findOne({
      user_id: req.userId,
    })
      .lean()
      .exec();

    if (!user) {
      return Response.json(
        {
          ok: false,
          message: 'Could not find this user.',
        },
        {
          status: 400,
        }
      );
    }

    // Pick out what we want to show the staff member and
    // exclude any sensitive information.
    let foundUser: FoundUserProps = {
      first_name: user.first_name,
      last_name: user.last_name,
      user_id: user.user_id,
      requires_assistance: user.requires_assistance ? true : false,
      wheelchair: user.wheelchair ? true : false,
      is_staff: user.is_staff,
    };

    return Response.json(foundUser, {
      status: 200,
    });
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
