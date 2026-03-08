import { AccountProps, Accounts } from '@/app/models/Accounts';
import { FoundUserProps } from '@/app/types/Accounts.types';
import { connectDB } from '@/lib/mongoose';
import { signIntoAccountWithCookie } from '@/lib/userAccount';

export async function POST(request: Request) {
  await connectDB();

  let filter = await request.json();
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

  if (!filter) filter = '';

  if (filter === '') {
    filter = {};
  } else {
    if (!Number.isNaN(Number(filter))) {
      // then we're searching via user id, not any other params
      filter = {
        user_id: Number(filter),
      };
    } else {
      let string = filter;
      filter = {
        $or: [
          { first_name: new RegExp(string, 'i') },
          { last_name: new RegExp(string, 'i') },
          { email: new RegExp(string, 'i') },
        ],
      };
    }
  }

  try {
    const users: AccountProps[] = await Accounts.find(filter).lean().exec();

    if (!users) {
      return Response.json(
        {
          ok: false,
          message: 'Could not find users at this time.',
        },
        {
          status: 500,
        }
      );
    }

    // Pick out what we want to show the staff member and
    // exclude any sensitive information.
    let foundUsers: FoundUserProps[] = [];

    if (users.length > 0) {
      for (let account of users) {
        foundUsers.push({
          first_name: account.first_name,
          last_name: account.last_name,
          is_staff: account.is_staff,
          user_id: account.user_id,
          requires_assistance: account.requires_assistance ? true : false,
          wheelchair: account.wheelchair ? true : false,
        });
      }
    }

    return Response.json(foundUsers, {
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
