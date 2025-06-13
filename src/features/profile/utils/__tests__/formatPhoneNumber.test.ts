// 🧪 formatPhoneNumber 함수가 전화번호를 잘 포맷하는지 테스트해요!
import { formatPhoneNumber } from '../formatPhoneNumber'

test('01012345678 → 010-1234-5678로 변환돼요', () => {
  expect(formatPhoneNumber('01012345678')).toBe('010-1234-5678')
})
