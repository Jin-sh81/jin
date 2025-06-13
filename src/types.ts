// 📝 타입 정의: JIN 앱에서 사용하는 타입들을 모아놓은 파일이에요
// 📋 검증 명령서:
// 1. 사용자 정보가 올바르게 입력되었는지 확인해요
// 2. 이메일 주소가 올바른 형식인지 확인해요
// 3. 사용자 이름이 입력되었는지 확인해요
// 4. 프로필 사진이 있는지 확인해요
// 5. 로그인 상태가 올바르게 저장되는지 확인해요

// 👤 사용자 정보 타입: JIN 앱에서 사용하는 사용자 정보의 모양을 정의해요
export interface User {
  uid: string;           // 🔑 사용자 고유 번호: 각 사용자를 구분하는 특별한 번호예요
  email: string | null;  // 📧 사용자 이메일: 로그인할 때 사용하는 이메일 주소예요
  displayName: string | null;  // 👤 사용자 이름: JIN 앱에서 보여질 이름이에요
  photoURL: string | null;     // 🖼️ 사용자 사진: 프로필에 보여질 사진 주소예요
}

// 🔐 인증 상태 타입: 사용자의 로그인 상태를 저장하는 모양을 정의해요
export interface AuthState {
  user: User | null;     // 👤 현재 로그인한 사용자 정보: 로그인했으면 사용자 정보가, 안 했으면 null이에요
  loading: boolean;      // 🔄 로딩 중인지: true면 로딩 중, false면 로딩이 끝났어요
  error: string | null;  // ⚠️ 오류 메시지: 문제가 생기면 오류 메시지가, 없으면 null이에요
}

// 📝 검증 방법:
// 1. User 타입 검증:
//    - uid는 반드시 있어야 해요
//    - email은 이메일 형식이어야 해요
//    - displayName은 선택사항이에요
//    - photoURL은 선택사항이에요
//
// 2. AuthState 타입 검증:
//    - user는 로그인 상태에 따라 달라져요
//    - loading은 true/false 중 하나여야 해요
//    - error는 문제가 있을 때만 메시지가 있어요 