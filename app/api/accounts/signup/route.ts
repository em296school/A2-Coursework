import Validator from '@/app/controllers/Validator/Validator';
import { AccountProps } from '@/app/models/Accounts';
import { RegistrationFormProps } from '@/app/types/Accounts.types';
import { generateMessageId, sendInboxMessage } from '@/lib/inbox';
import { connectDB } from '@/lib/mongoose';
import { tryMakeAccount } from '@/lib/userAccount';

const WELCOME_MESSAGE =
  "We're so glad to welcome you to GreenGlide Airlines. We aim to provide a sustainably-driven travel agent for customers across the UK and Ireland. Get started by browsing our flights.";

export async function POST(request: Request) {
  await connectDB();

  const accountInfo: Partial<RegistrationFormProps> = await request.json();
  const validator = new Validator(accountInfo);

  // Check that this data can be validated.
  if (!validator.validateSignUp()) {
    return Response.json(
      {
        ok: false,
        message: 'Invalid data sent to sign up.',
      },
      {
        status: 400,
      }
    );
  }

  // Try and make the account:
  let plainPassword = <string>accountInfo.password;
  delete accountInfo.password;

  try {
    let createdAccount = await tryMakeAccount(
      accountInfo as AccountProps,
      plainPassword
    );

    if (createdAccount) {
      await sendInboxMessage(createdAccount.user_id, {
        author: 'system',
        message_id: await generateMessageId(0, createdAccount.user_id),
        timestamp: new Date().getTime(),
        unread: true,
        message: {
          title: 'Welcome to GreenGlide!',
          contents: WELCOME_MESSAGE,
        },
      });

      return Response.json(
        {
          ok: true,
          message: 'Successfully created account.',
        },
        {
          status: 200,
        }
      );
    }
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
