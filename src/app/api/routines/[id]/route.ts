import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';

export async function GET(
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

    return NextResponse.json(routine);
  } catch (error) {
    console.error('루틴 조회 중 오류 발생:', error);
    return NextResponse.json(
      { message: '루틴 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    let beforeImagePath = routine.beforeImage;
    let afterImagePath = routine.afterImage;

    if (beforeImage) {
      if (routine.beforeImage) {
        const oldPath = join(process.cwd(), 'public', routine.beforeImage);
        try {
          await unlink(oldPath);
        } catch (error) {
          console.error('이전 이미지 삭제 실패:', error);
        }
      }

      const bytes = await beforeImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `before_${Date.now()}_${beforeImage.name}`;
      const path = join(process.cwd(), 'public', 'uploads', fileName);
      await writeFile(path, buffer);
      beforeImagePath = `/uploads/${fileName}`;
    }

    if (afterImage) {
      if (routine.afterImage) {
        const oldPath = join(process.cwd(), 'public', routine.afterImage);
        try {
          await unlink(oldPath);
        } catch (error) {
          console.error('이전 이미지 삭제 실패:', error);
        }
      }

      const bytes = await afterImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `after_${Date.now()}_${afterImage.name}`;
      const path = join(process.cwd(), 'public', 'uploads', fileName);
      await writeFile(path, buffer);
      afterImagePath = `/uploads/${fileName}`;
    }

    const updatedRoutine = await prisma.routine.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        time,
        color,
        message,
        repeat,
        notification,
        beforeImage: beforeImagePath,
        afterImage: afterImagePath,
      },
    });

    return NextResponse.json(updatedRoutine);
  } catch (error) {
    console.error('루틴 수정 중 오류 발생:', error);
    return NextResponse.json(
      { message: '루틴 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    if (routine.beforeImage) {
      const beforeImagePath = join(process.cwd(), 'public', routine.beforeImage);
      try {
        await unlink(beforeImagePath);
      } catch (error) {
        console.error('이미지 삭제 실패:', error);
      }
    }

    if (routine.afterImage) {
      const afterImagePath = join(process.cwd(), 'public', routine.afterImage);
      try {
        await unlink(afterImagePath);
      } catch (error) {
        console.error('이미지 삭제 실패:', error);
      }
    }

    await prisma.routine.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: '루틴이 삭제되었습니다.' });
  } catch (error) {
    console.error('루틴 삭제 중 오류 발생:', error);
    return NextResponse.json(
      { message: '루틴 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
} 