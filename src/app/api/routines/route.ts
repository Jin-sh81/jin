import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const data = await request.json();

    if (!data.title || !data.time) {
      return NextResponse.json(
        { error: '제목과 시간은 필수 입력 항목입니다.' },
        { status: 400 }
      );
    }

    const routine = await prisma.routine.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    });

    return NextResponse.json(routine);
  } catch (error) {
    console.error('루틴 생성 중 오류 발생:', error);
    return NextResponse.json(
      { error: '루틴을 생성하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const routines = await prisma.routine.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(routines);
  } catch (error) {
    console.error('루틴 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '루틴을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 