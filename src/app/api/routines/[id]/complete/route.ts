import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const routine = await prisma.routine.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!routine) {
      return NextResponse.json(
        { message: '루틴을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const updatedRoutine = await prisma.routine.update({
      where: {
        id: params.id,
      },
      data: {
        completed: !routine.completed,
      },
    });

    return NextResponse.json(updatedRoutine);
  } catch (error) {
    console.error('루틴 완료 처리 중 오류 발생:', error);
    return NextResponse.json(
      { message: '루틴 완료 처리에 실패했습니다.' },
      { status: 500 }
    );
  }
} 