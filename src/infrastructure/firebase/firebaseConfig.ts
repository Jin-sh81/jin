// 🔥 Firebase 관련 패키지 가져오기
import { initializeApp } from 'firebase/app'        // Firebase 앱 초기화
import { getAuth } from 'firebase/auth'            // 인증 서비스
import { getFirestore } from 'firebase/firestore'  // 데이터베이스
import { getStorage } from 'firebase/storage'      // 파일 저장소

/**
 * 🔥 Firebase 설정
 * 
 * 이 파일은 Firebase 서비스를 초기화하고 필요한 인스턴스들을 생성합니다.
 * 환경변수는 Vite의 import.meta.env를 통해 접근합니다.
 * 
 * 환경변수 설정 방법:
 * 1. 프로젝트 루트에 .env 파일 생성
 * 2. Firebase 콘솔에서 가져온 설정값 입력
 * 
 * 예시:
 * ```env
 * VITE_FIREBASE_API_KEY=your_api_key
 * VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
 * VITE_FIREBASE_PROJECT_ID=your_project_id
 * VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
 * VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
 * VITE_FIREBASE_APP_ID=your_app_id
 * ```
 */

// Firebase 설정 객체
const firebaseConfig = {
  // Firebase 콘솔에서 가져온 API 키
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  
  // Firebase 프로젝트의 도메인
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  
  // Firebase 프로젝트 ID
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  
  // Firebase Storage 버킷 URL
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  
  // Firebase 메시징 발신자 ID
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  
  // Firebase 앱 ID
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig)

// Firebase 서비스 인스턴스 생성 및 내보내기
export const auth = getAuth(app)      // 인증 서비스 (로그인, 회원가입 등)
export const db = getFirestore(app)   // Firestore 데이터베이스 (데이터 저장)
export const storage = getStorage(app) // Storage 서비스 (파일 업로드)

// Firebase 앱 인스턴스 (필요한 경우 사용)
export default app

/**
 * 🔥 사용 방법
 * 
 * 1. 인증 서비스 사용 예시:
 * ```typescript
 * import { auth } from '@/infrastructure/firebase/firebaseConfig';
 * 
 * // 로그인
 * auth.signInWithEmailAndPassword(email, password);
 * ```
 * 
 * 2. 데이터베이스 사용 예시:
 * ```typescript
 * import { db } from '@/infrastructure/firebase/firebaseConfig';
 * 
 * // 데이터 저장
 * db.collection('users').doc(uid).set(data);
 * ```
 * 
 * 3. Storage 사용 예시:
 * ```typescript
 * import { storage } from '@/infrastructure/firebase/firebaseConfig';
 * 
 * // 파일 업로드
 * storage.ref().child('path/to/file').put(file);
 * ```
 */ 