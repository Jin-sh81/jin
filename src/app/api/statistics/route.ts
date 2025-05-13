import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

interface Routine {
  completed: boolean;
  createdAt: Date;
  repeat: string[];
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
      select: {
        completed: true,
        createdAt: true,
        repeat: true,
      },
    }) as Routine[];

    const totalRoutines = routines.length;
    const completedRoutines = routines.filter((routine: Routine) => routine.completed).length;
    const completionRate = totalRoutines > 0 ? (completedRoutines / totalRoutines) * 100 : 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRoutines = routines.filter((routine: Routine) => {
      const routineDate = new Date(routine.createdAt);
      routineDate.setHours(0, 0, 0, 0);
      return routineDate.getTime() === today.getTime();
    });

    const todayCompletedRoutines = todayRoutines.filter((routine: Routine) => routine.completed).length;
    const todayCompletionRate = todayRoutines.length > 0 ? (todayCompletedRoutines / todayRoutines.length) * 100 : 0;

    const weeklyStats = Array(7).fill(0).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - index);
      date.setHours(0, 0, 0, 0);

      const dayRoutines = routines.filter((routine: Routine) => {
        const routineDate = new Date(routine.createdAt);
        routineDate.setHours(0, 0, 0, 0);
        return routineDate.getTime() === date.getTime();
      });

      const completedDayRoutines = dayRoutines.filter((routine: Routine) => routine.completed).length;
      const completionRate = dayRoutines.length > 0 ? (completedDayRoutines / dayRoutines.length) * 100 : 0;

      return {
        date: date.toISOString().split('T')[0],
        total: dayRoutines.length,
        completed: completedDayRoutines,
        completionRate,
      };
    }).reverse();

    const repeatStats = routines.reduce((acc: Record<string, number>, routine: Routine) => {
      routine.repeat.forEach((day: string) => {
        if (!acc[day]) {
          acc[day] = 0;
        }
        acc[day]++;
      });
      return acc;
    }, {});

    return NextResponse.json({
      totalRoutines,
      completedRoutines,
      completionRate,
      todayRoutines: todayRoutines.length,
      todayCompletedRoutines,
      todayCompletionRate,
      weeklyStats,
      repeatStats,
    });
  } catch (error) {
    console.error('통계 조회 중 오류 발생:', error);
    return NextResponse.json(
      { message: '통계 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
} 