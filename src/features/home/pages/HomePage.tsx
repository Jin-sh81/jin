import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProjects } from '@/services/projectService'
import { getRoutines } from '@/services/routineService'
import { getExpenses } from '@/services/expenseService'
import type { Project } from '@/types/project'
import type { Routine } from '@/types/routine'
import type { Expense } from '@/types/expense'
import { useAuth } from '@/hooks/useAuth'

// 🏠 HomePage는 우리 앱의 첫 화면이에요
// 👋 사용자에게 환영 인사를 보여주는 페이지예요
export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 🎉 환영 메시지 제목 */}
      <h1 className="text-3xl font-bold text-center mb-4">
        JIN에 오신 것을 환영합니다!
      </h1>
      
      {/* 📝 앱의 주요 기능을 소개하는 설명 */}
      <p className="text-center text-gray-600">
        매일의 루틴, 프로젝트, 지출, 일기를 한 곳에서 관리해 보세요.
      </p>

      {/* 🎯 주요 기능 바로가기 버튼들 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <button className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200">
          📅 루틴
        </button>
        <button className="p-4 bg-green-100 rounded-lg hover:bg-green-200">
          📋 프로젝트
        </button>
        <button className="p-4 bg-yellow-100 rounded-lg hover:bg-yellow-200">
          💰 지출
        </button>
        <button className="p-4 bg-purple-100 rounded-lg hover:bg-purple-200">
          📝 일기
        </button>
      </div>
    </div>
  )
} 