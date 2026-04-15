import { connectDB } from '@/lib/mongoose';
import { logOut } from '@/lib/userAccount';

export async function POST(request: Request) {
  await connectDB();

  try {
    const success = await logOut();

    if (!success) {
      return Response.json(
        {
          ok: false,
          message: 'Unexpected error encountered.',
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        ok: true,
        message: 'Successfully logged out.',
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
        message: message || 'Unexpected error encountered.',
      },
      {
        status: 500,
      }
    );
  }
}
