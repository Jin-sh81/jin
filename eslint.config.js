// 🔽 ESLint Flat Config 호환성 레이어 임포트
import { FlatCompat } from "@eslint/eslintrc"
import eslint from '@eslint/js'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'

// 🔽 ESLint 기본 설정 임포트
const recommendedConfig = eslint.configs.recommended

// 🔽 FlatCompat 인스턴스 생성
const compat = new FlatCompat({
  recommendedConfig
})

export default [
  // 🔽 베이스 설정 (예: Recommended, React, TypeScript 등)
  ...compat.extends(
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ),

  // 🔽 플러그인 명시적으로 추가
  {
    plugins: {
      'react-hooks': eslintPluginReactHooks,
    },
  },

  // 🔽 환경 설정
  {
    files: ["*.ts", "*.tsx", "*.js", "*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        // 브라우저 환경
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        // Node.js 환경
        process: "readonly",
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
        __filename: "readonly"
      }
    },
    settings: {
      react: { version: "detect" },
    },
  },

  // 🔽 프로젝트별 커스텀 룰
  {
    rules: {
      // 🔸 세미콜론 강제 금지
      "semi": ["error", "never"],
      // 🔸 React에서 JSX 사용 시 React import 불필요 경고 해제
      "react/react-in-jsx-scope": "off",
      // 🔸 @typescript-eslint 규칙
      "@typescript-eslint/no-unused-vars": ["warn"],
      // 🔸 any 타입 사용 시 경고
      "@typescript-eslint/no-explicit-any": "warn",
      // 🔸 React Hooks 규칙
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn"
    },
  },
] 