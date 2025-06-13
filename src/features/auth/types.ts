// 📝 인증 관련 타입 정의: 사용자 정보와 로그인 상태를 담는 도구예요!

// 👤 User: 로그인한 사용자의 고유 정보(UID, 이메일, 이름, 사진)를 담아요
export interface User {
  // 🔑 uid: 사용자를 구별하는 고유 ID예요
  uid: string;
  // 📧 email: 사용자의 이메일, 없을 수도 있어요
  email: string | null;
  // 🏷️ displayName: 사용자의 이름, 없을 수도 있어요
  displayName: string | null;
  // 🖼️ photoURL: 프로필 사진 주소, 없을 수도 있어요
  photoURL: string | null;
}

// 🔐 AuthState: 현재 로그인 상태(사용자 정보, 로딩, 에러)를 담는 상자예요
export interface AuthState {
  // 👤 user: 현재 로그인한 User 정보, 없으면 null이에요
  user: User | null;
  // ⏳ loading: 로그인 상태를 불러오는 중인지 여부를 알려줘요
  loading: boolean;
  // 🚨 error: 로그인 중 생긴 오류 메시지를 담아요
  error: string | null;
  // 🔄 isGoogleLoading: 구글 로그인 중인지 알려주는 표시등이에요
  isGoogleLoading: boolean;
  // 💾 rememberMe: 로그인 상태를 기억할지 여부를 알려줘요
  rememberMe: boolean;
}

// 🔑 LoginCredentials: 로그인에 필요한 정보를 담는 상자예요
export interface LoginCredentials {
  // 📧 email: 사용자의 이메일이에요
  email: string;
  // 🔒 password: 사용자의 비밀번호예요
  password: string;
  // 💾 rememberMe: 로그인 상태를 기억할지 여부예요
  rememberMe: boolean;
}

// 🔄 AuthAction: 인증 관련 동작을 정의해요
export type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_REMEMBER_ME'; payload: boolean }; 