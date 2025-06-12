import React from 'react'

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  
  componentDidCatch(error: any) {
    console.error('❌ ErrorBoundary:', error)
  }
  
  render() {
    if (this.state.hasError) {
      return <div className="p-8 text-red-600">앱 실행 중 오류가 발생했습니다. 콘솔을 확인하세요.</div>
    }
    return this.props.children
  }
} 