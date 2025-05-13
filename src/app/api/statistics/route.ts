import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import type { Routine } from '@prisma/client';

interface RoutineWithRepeat extends Routine {
  repeat: string[];
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
    }) as RoutineWithRepeat[];

    const totalRoutines = routines.length;
    const completedRoutines = routines.filter((r: RoutineWithRepeat) => r.completed).length;
    const completionRate = totalRoutines > 0 ? (completedRoutines / totalRoutines) * 100 : 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRoutines = routines.filter((r: RoutineWithRepeat) => {
      const routineDate = new Date(r.createdAt);
      routineDate.setHours(0, 0, 0, 0);
      return routineDate.getTime() === today.getTime();
    });

    const todayCompleted = todayRoutines.filter((r: RoutineWithRepeat) => r.completed).length;
    const todayCompletionRate = todayRoutines.length > 0 ? (todayCompleted / todayRoutines.length) * 100 : 0;

    const weeklyStats = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayRoutines = routines.filter((r: RoutineWithRepeat) => {
        const routineDate = new Date(r.createdAt);
        routineDate.setHours(0, 0, 0, 0);
        return routineDate.getTime() === date.getTime();
      });

      return {
        date: date.toISOString().split('T')[0],
        total: dayRoutines.length,
        completed: dayRoutines.filter((r: RoutineWithRepeat) => r.completed).length,
        completionRate: dayRoutines.length > 0 ? (dayRoutines.filter((r: RoutineWithRepeat) => r.completed).length / dayRoutines.length) * 100 : 0,
      };
    });

    const repeatStats = routines.reduce((acc: Record<string, number>, routine: RoutineWithRepeat) => {
      routine.repeat.forEach((day: string) => {
        acc[day] = (acc[day] || 0) + 1;
      });
      return acc;
    }, {});

    return NextResponse.json({
      totalRoutines,
      completedRoutines,
      completionRate,
      todayRoutines: todayRoutines.length,
      todayCompleted,
      todayCompletionRate,
      weeklyStats,
      repeatStats,
    });
  } catch (error) {
    console.error('통계 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '통계를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 