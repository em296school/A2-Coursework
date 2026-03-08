import { SupportQueries, SupportQueryProps } from '@/app/models/SupportQueries';
import { connectDB } from '@/lib/mongoose';
import { signIntoAccountWithCookie } from '@/lib/userAccount';

export async function GET(request: Request) {
  await connectDB();
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
  // Get all queries and send them back to be used
  try {
    let queries: SupportQueryProps[] = await SupportQueries.find({})
      .lean()
      .exec();

    if (!queries) {
      return Response.json(
        {
          ok: false,
          message: 'Could not get queries at this time.',
        },
        {
          status: 500,
        }
      );
    }

    // Clean up the queries
    queries = queries.map((query) => {
      delete query._id;
      return query;
    });

    return Response.json(queries, {
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
