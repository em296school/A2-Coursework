import { Accounts } from '@/app/models/Accounts';
import { connectDB } from '@/lib/mongoose';
import { signIntoAccountWithCookie } from '@/lib/userAccount';

export async function POST(request: Request) {
  await connectDB();

  const { userId }: { userId: number } = await request.json();
  const account = await signIntoAccountWithCookie();

  if (!account || (account && !account.is_admin)) {
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

  if (!userId || (userId && typeof userId != 'number')) {
    return Response.json(
      {
        ok: false,
        message: 'This account does not exist.',
      },
      {
        status: 400,
      }
    );
  }

  // Try find the account and if so, update.
  try {
    const success = await Accounts.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        is_staff: true,
      }
    ).exec();

    if (!success) {
      return Response.json(
        {
          ok: false,
          message: 'Could not make user staff at this time.',
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        ok: true,
        message: 'Successfully promoted user.',
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
