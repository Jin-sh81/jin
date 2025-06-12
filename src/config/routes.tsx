import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/shared/layouts/MainLayout'
import HomePage from '@/features/home/pages/HomePage'
import RoutinePage from '@/features/routine/pages/RoutinePage'
import RoutineOverview from '@/features/routine/components/RoutineOverview'

// 🎯 프로젝트 관련 페이지들을 불러옵니다
// 📋 ProjectList: 프로젝트 목록을 보여주는 페이지
// 📝 ProjectForm: 새 프로젝트를 만들거나 수정하는 페이지
// 🔍 ProjectDetail: 프로젝트의 자세한 내용을 보여주는 페이지
import { ProjectList } from '@/features/project/components/ProjectList'
import { ProjectForm } from '@/features/project/components/ProjectForm'
import { ProjectDetail } from '@/features/project/components/ProjectDetail'
// 📊 ProjectStats: 프로젝트 통계를 보여주는 페이지 (필요할 때 주석 해제)
// import { ProjectStats } from '@/features/project/components/ProjectStats'

import ProjectPage from '@/features/project/pages/ProjectPage'
import ProjectDetailPage from '@/features/project/pages/ProjectDetailPage'
import ProjectStatsPage from '@/features/project/pages/ProjectStatsPage'
import ExpensePage from '@/features/expense/pages/ExpensePage'
import ExpenseDetailPage from '@/features/expense/pages/ExpenseDetailPage'
import ExpenseStatsPage from '@/features/expense/pages/ExpenseStatsPage'
import DiaryPage from '@/features/diary/pages/DiaryPage'
import DiaryDetailPage from '@/features/diary/pages/DiaryDetailPage'
import DiaryExportPage from '@/features/diary/pages/DiaryExportPage'
import NotFound from '@/shared/components/NotFound'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="routine" element={<RoutinePage />} />
        <Route path="routine/overview/:routineId" element={<RoutineOverview />} />

        {/* 🎯 프로젝트 관련 페이지 연결하기
            각 페이지는 다른 URL로 연결됩니다:
            - /projects: 모든 프로젝트 목록을 보여줍니다
            - /projects/new: 새 프로젝트를 만드는 페이지입니다
            - /projects/123: 123번 프로젝트의 자세한 내용을 보여줍니다
            - /projects/stats: 프로젝트 통계를 보여줍니다 */}
        <Route path="projects" element={<ProjectList />} />
        <Route path="projects/new" element={<ProjectForm />} />
        <Route path="projects/:projectId" element={<ProjectDetail />} />
        <Route path="projects/stats" element={<ProjectStatsPage />} />

        <Route path="expenses" element={<ExpensePage />} />
        <Route path="expenses/:expenseId" element={<ExpenseDetailPage />} />
        <Route path="expenses/stats" element={<ExpenseStatsPage />} />
        <Route path="diaries" element={<DiaryPage />} />
        <Route path="diaries/:date" element={<DiaryDetailPage />} />
        <Route path="diaries/export" element={<DiaryExportPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
} 