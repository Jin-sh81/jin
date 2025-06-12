/**
 * 프로젝트 관련 타입 정의
 */

// 🎨 프로젝트 타입 정의 파일이에요
// 🔍 Firestore에서 가져오는 데이터와 컴포넌트에서 사용하는 데이터의 모양을 정해주는 규칙이에요

export interface Project {
  id: string;                 // 프로젝트 고유 ID (각 프로젝트를 구분하는 번호예요)
  title: string;              // 프로젝트 제목 (프로젝트의 이름이에요)
  description?: string;       // 프로젝트 설명 (선택사항) (프로젝트에 대한 자세한 설명이에요)
  status: 'not_started' | 'in_progress' | 'completed';  // 프로젝트 상태 (시작 전, 진행 중, 완료 중 하나를 선택해요)
  startDate: string;          // 시작 날짜 (프로젝트를 시작하는 날짜예요)
  endDate?: string;           // 종료 날짜 (선택사항) (프로젝트가 끝나는 날짜예요)
  tasks: ProjectTask[];       // 작업 목록 (프로젝트 안에 있는 할 일들의 목록이에요)
  createdAt: string;          // 생성 시간 (프로젝트를 만든 시간이에요)
  updatedAt?: string;         // 수정 시간 (선택사항) (프로젝트를 마지막으로 수정한 시간이에요)
  priority?: 'low' | 'medium' | 'high';  // 우선순위 (선택사항) (프로젝트의 중요도를 나타내요)
}

export interface ProjectTask {
  id: string;                // 작업 고유 ID (각 작업을 구분하는 번호예요)
  title: string;             // 작업 제목 (할 일의 이름이에요)
  description?: string;      // 작업 설명 (선택사항) (할 일에 대한 자세한 설명이에요)
  status: 'todo' | 'in_progress' | 'completed';  // 작업 상태 (할 일, 진행 중, 완료 중 하나를 선택해요)
  priority: 'low' | 'medium' | 'high';  // 우선순위 (할 일의 중요도를 나타내요)
  dueDate?: string;         // 마감 날짜 (선택사항) (할 일을 끝내야 하는 날짜예요)
  completedAt?: string;     // 완료 시간 (선택사항) (할 일을 끝낸 시간이에요)
  createdAt: string;        // 생성 시간 (할 일을 만든 시간이에요)
  updatedAt?: string;       // 수정 시간 (선택사항) (할 일을 마지막으로 수정한 시간이에요)
}

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
}

export interface ProjectDetailModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (projectId: string) => Promise<void>;
}

// 아래는 통계 타입 예시입니다.
export interface ProjectOverviewStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  onHoldProjects: number;
  projectsByPriority: {
    low: number;
    medium: number;
    high: number;
  };
  projectsByMonth: {
    [key: string]: number;
  };
}

export interface ProjectAttachment {
  id: string;               // 첨부파일 고유 ID
  name: string;             // 파일 이름
  url: string;              // 파일 URL
  type: string;             // 파일 타입
  size: number;             // 파일 크기
  createdAt: string;        // 업로드 시간
} 