// 🌟 인증 모듈: 여기서 인증 관련 타입, 훅, 컴포넌트를 한 번에 꺼내올 수 있어요!
// 📋 경로 검증 명령서:
// 1. 모든 파일이 올바른 위치에 있는지 확인해요
// 2. 내보내는 파일들이 실제로 존재하는지 확인해요
// 3. 경로가 올바르게 설정되어 있는지 확인해요
// 4. 순환 참조가 없는지 확인해요
// 5. 필요한 모든 파일이 내보내지는지 확인해요

// 📁 파일 구조:
// src/features/auth/
// ├── types.ts         // 📝 타입 정의
// ├── hooks/           // 🎣 훅 모음
// │   └── useAuth.ts   // 🔑 인증 훅
// ├── components/      // 🎨 컴포넌트 모음
// │   └── index.ts     // 🛡️ 컴포넌트 내보내기
// └── index.ts         // 🌟 메인 내보내기

// 📝 타입 내보내기: User, AuthState 타입을 사용할 수 있어요
// - User: 사용자 정보 타입
// - AuthState: 인증 상태 타입
export * from './types'

// 🔑 훅 내보내기: useAuth 훅을 사용할 수 있어요
// - useAuth: 사용자 인증 상태를 관리하는 훅
export * from '@hooks/useAuth'

// 🛡️ 컴포넌트 내보내기: AuthProvider와 useAuthContext를 사용할 수 있어요
// - AuthProvider: 인증 상태를 제공하는 컴포넌트
// - useAuthContext: 인증 컨텍스트를 사용하는 훅
export * from './components'

// 📝 검증 방법:
// 1. 타입 검증:
//    - types.ts 파일이 존재하는지 확인
//    - 필요한 타입이 모두 내보내지는지 확인
//
// 2. 훅 검증:
//    - useAuth.ts 파일이 올바른 경로에 있는지 확인
//    - 훅이 올바르게 내보내지는지 확인
//
// 3. 컴포넌트 검증:
//    - components 폴더가 존재하는지 확인
//    - 필요한 컴포넌트가 모두 내보내지는지 확인 