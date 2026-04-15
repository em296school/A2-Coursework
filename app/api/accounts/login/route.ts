import Validator from '@/app/controllers/Validator/Validator';
import { AccountProps } from '@/app/models/Accounts';
import { LogInFormProps } from '@/app/types/Accounts.types';
import { connectDB } from '@/lib/mongoose';
import { signIntoAccount, tryMakeAccount } from '@/lib/userAccount';

export async function POST(request: Request) {
  await connectDB();
  const accountInfo: LogInFormProps = await request.json();
  const validator = new Validator(accountInfo);

  // Check that this data can be validated.
  if (!validator.validateLogIn()) {
    return Response.json(
      {
        ok: false,
        message: 'Invalid data sent to login.',
      },
      {
        status: 400,
      }
    );
  }

  // Try to log in:
  try {
    let success = await signIntoAccount(
      accountInfo.email,
      accountInfo.password
    );

    if (!success) {
      return Response.json(
        {
          ok: false,
          message: 'Could not log in at this time.',
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        ok: true,
        message: 'Successfully logged in.',
      },
      {
        status: 200,
      }
    );
  } catch (err: Error | any) {
    let message = err?.message;
    return Response.json(
      {
        ok: false,
        message: message || 'An unexpected error was encountered.',
      },
      {
        status: 500,
      }
    );
  }
}
