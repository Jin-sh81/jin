// 💾 RememberMeCheckbox: 로그인 상태를 기억할지 선택하는 체크박스예요!
import React from 'react'

interface RememberMeCheckboxProps {
  // 💾 checked: 체크박스가 선택되어 있는지 여부예요
  checked: boolean;
  // 👆 onChange: 체크박스 상태가 변경될 때 호출되는 함수예요
  onChange: (checked: boolean) => void;
}

export const RememberMeCheckbox: React.FC<RememberMeCheckboxProps> = ({
  checked,
  onChange
}) => {
  return (
    <div className="flex items-center">
      <input
        id="remember-me"
        name="remember-me"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
        로그인 상태 유지
      </label>
    </div>
  )
}
