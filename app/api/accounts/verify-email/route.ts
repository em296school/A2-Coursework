import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const challenge = searchParams.get('challenge');
    const objective = searchParams.get('objective');

    if (!challenge || !objective) {
        return NextResponse.json({ error: 'Challenge or objective parameter is missing' }, { status: 400 });
    }

    return NextResponse.json({ message: challenge });
}