// ❗ InlineError: 입력창 아래에 바로 보여주는 에러 메시지예요!
import React from 'react'

interface InlineErrorProps {
  message?: string
}

const InlineError: React.FC<InlineErrorProps> = ({ message }) =>
  message ? (
    <span className="text-red-500 text-xs mt-1 block" role="alert">
      {message}
    </span>
  ) : null

export default InlineError
