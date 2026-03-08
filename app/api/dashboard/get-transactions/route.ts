import Validator from '@/app/controllers/Validator/Validator';
import { formatToName } from '@/app/helpers/formatToName';
import { Accounts } from '@/app/models/Accounts';
import { Inboxes, InboxProps } from '@/app/models/Inboxes';
import { Transactions, TransactionsProps } from '@/app/models/Transactions';
import { generateMessageId } from '@/lib/inbox';
import { connectDB } from '@/lib/mongoose';
import { signIntoAccountWithCookie } from '@/lib/userAccount';

export async function GET(request: Request) {
  await connectDB();

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

  // Get the transactions
  try {
    let transactions: TransactionsProps[] = await Transactions.find({})
      .lean()
      .exec();

    transactions = transactions.map((transaction) => {
      delete transaction._id;

      return transaction;
    });

    return Response.json(transactions, {
      status: 200,
    });
  } catch {
    return Response.json(
      {
        ok: false,
        message: 'Could not get transactions at this time.',
      },
      {
        status: 500,
      }
    );
  }
}
