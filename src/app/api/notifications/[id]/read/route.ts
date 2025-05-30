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

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const notification = await prisma.notification.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!notification) {
      return NextResponse.json(
        { error: '알림을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const updatedNotification = await prisma.notification.update({
      where: {
        id: params.id,
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error('알림 읽음 처리 중 오류 발생:', error);
    return NextResponse.json(
      { error: '알림 읽음 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 