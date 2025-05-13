import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const time = formData.get('time') as string;
    const color = formData.get('color') as string;
    const message = formData.get('message') as string;
    const repeat = JSON.parse(formData.get('repeat') as string) as string[];
    const notification = formData.get('notification') === 'true';
    const beforeImage = formData.get('beforeImage') as File | null;
    const afterImage = formData.get('afterImage') as File | null;

    if (!title || !time) {
      return NextResponse.json(
        { message: '제목과 시간은 필수입니다.' },
        { status: 400 }
      );
    }

    let beforeImagePath = null;
    let afterImagePath = null;

    if (beforeImage) {
      const bytes = await beforeImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `before_${Date.now()}_${beforeImage.name}`;
      const path = join(process.cwd(), 'public', 'uploads', fileName);
      await writeFile(path, buffer);
      beforeImagePath = `/uploads/${fileName}`;
    }

    if (afterImage) {
      const bytes = await afterImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `after_${Date.now()}_${afterImage.name}`;
      const path = join(process.cwd(), 'public', 'uploads', fileName);
      await writeFile(path, buffer);
      afterImagePath = `/uploads/${fileName}`;
    }

    const routine = await prisma.routine.create({
      data: {
        title,
        time,
        color,
        message,
        repeat,
        notification,
        beforeImage: beforeImagePath,
        afterImage: afterImagePath,
        userId: session.user.id,
      },
    });

    return NextResponse.json(routine);
  } catch (error) {
    console.error('루틴 생성 중 오류 발생:', error);
    return NextResponse.json(
      { message: '루틴 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: '인증이 필요합니다.' },
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
      { message: '루틴 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
} 