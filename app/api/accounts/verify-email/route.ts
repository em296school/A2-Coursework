import { OTPEmail } from '@/app/components/2FAEmail';
import { EmailChallengeModel } from '@/app/schemas/EmailChallenge';
import { connect } from 'mongoose';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

function generate6Digits() {
  return Math.floor(100000 + Math.random() * 900000);
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('challenge');
  const objective = searchParams.get('objective');

  if (!challenge || !objective) {
    return NextResponse.json(
      { error: 'Challenge or objective parameter is missing' },
      { status: 400 }
    );
  }

  // Generate an email key
  const key = generate6Digits().toString();

  // Try connect and save the key
  try {
    await connect(
      'mongodb+srv://admin:xgWQNOHXT0TrCb5g@greenglide.smp4sg1.mongodb.net/?appName=GreenGlide'
    );
    const challengeDoc = new EmailChallengeModel({
      objective: objective,
      authenticationCode: key,
    });

    await challengeDoc.save();
    /**const { data, error } = await resend.emails.send({
      from: '2FA <messages@greenglide-airlines.com>',
      to: [objective],
      subject: '[OTP] Email Verification Code',
      react: OTPEmail({ code: key }),
    });**/
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
