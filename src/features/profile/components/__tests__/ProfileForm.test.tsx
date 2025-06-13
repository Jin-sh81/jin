// 🧪 ProfileForm 컴포넌트가 잘 렌더링되고, 입력/저장이 잘 되는지 테스트해요!
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ProfileForm from '../ProfileForm'

const mockProfile = {
  displayName: '홍길동',
  email: 'hong@sample.com',
  phoneNumber: '010-1234-5678',
  address: '서울시 강남구'
}

test('이름, 이메일, 전화번호, 주소 입력창이 보이고, 저장 버튼이 동작해요', () => {
  const handleSave = jest.fn()
  render(<ProfileForm initialProfile={mockProfile} onSave={handleSave} loading={false} />)

  // 입력창이 화면에 보여요!
  expect(screen.getByLabelText(/이름/)).toBeInTheDocument()
  expect(screen.getByLabelText(/이메일/)).toBeInTheDocument()
  expect(screen.getByLabelText(/전화번호/)).toBeInTheDocument()
  expect(screen.getByLabelText(/주소/)).toBeInTheDocument()

  // 입력값을 바꿔요!
  fireEvent.change(screen.getByLabelText(/이름/), { target: { value: '김철수' } })
  fireEvent.click(screen.getByText('저장하기'))

  // 저장 함수가 호출돼요!
  expect(handleSave).toHaveBeenCalled()
})
