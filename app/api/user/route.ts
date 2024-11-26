import prisma from '@/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, platform } = body;
  const response = await prisma.user.findFirst({
    where: {
      email: email,
    },
    include: {
      post: {
        where: {
          type: platform,
        },
      },
    },
  });

  if (!response) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(response);
}
