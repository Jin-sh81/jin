import React, { useEffect, useState } from 'react'
import { auth } from '@/infrastructure/firebase/firebaseConfig'
import { getExpenseStats } from '@/services/expenseService'
import { ExpenseStats } from '@/types/expense'
import { useAuth } from '@/hooks/useAuth'

// 📊 ExpenseStatsPage는 지출 통계를 보여주는 페이지예요
// 💰 총 지출액과 카테고리별 지출을 한눈에 볼 수 있어요
export default function ExpenseStatsPage() {
  const uid = auth.currentUser?.uid || ''
  
  // 📦 통계 데이터를 저장할 상자
  const [stats, setStats] = useState<{ total: number; byCategory: Record<string, number> }>({
    total: 0,
    byCategory: {},
  })

  // 🔄 페이지가 로드될 때 통계 데이터를 가져와요
  useEffect(() => {
    if (!uid) return
    // 📅 현재 연월을 YYYY-MM 형식으로 가져와요
    const now = new Date()
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    
    getExpenseStats(uid, yearMonth).then(data => {
      // 🔄 데이터 형식을 맞춰서 저장해요
      setStats({
        total: data.totalAmount,
        byCategory: data.categoryStats
      })
    })
  }, [uid])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 🎯 페이지 제목 */}
      <h1 className="text-2xl font-bold mb-4">지출 통계</h1>
      
      {/* 💰 총 지출액 */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">총 지출</h2>
        <p className="text-2xl font-bold text-blue-600">
          ₩{stats.total.toLocaleString()}
        </p>
      </div>

      {/* 📊 카테고리별 지출 */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">카테고리별 지출</h2>
        <div className="space-y-2">
          {Object.entries(stats.byCategory).map(([category, amount]) => (
            <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium">{category}</span>
              <span className="text-green-600">₩{amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 