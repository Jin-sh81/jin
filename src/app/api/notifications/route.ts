import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('알림 조회 중 오류 발생:', error);
    return NextResponse.json(
      { message: '알림 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const { title, message } = await request.json();

    if (!title || !message) {
      return NextResponse.json(
        { message: '제목과 메시지는 필수입니다.' },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        userId: session.user.id,
      },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error('알림 생성 중 오류 발생:', error);
    return NextResponse.json(
      { message: '알림 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
} 