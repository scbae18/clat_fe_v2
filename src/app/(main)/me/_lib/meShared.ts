export const MSG = {
  pageTitle: '내 정보',
  pageDesc: '클랫에 로그인할 때 쓰는 계정 정보예요.',
  basicTitle: '기본 정보',
  basicDesc: '수업에 표시되는 선생님 이름이에요.',
  loginTitle: '로그인 정보',
  loginDesc: '로그인에 쓰는 이메일이에요. 바꿀 때 비밀번호로 확인할게요.',
  securityTitle: '보안',
  securityDesc: '현재 비밀번호를 확인한 뒤 새 비밀번호로 바꿔요.',
  dangerTitle: '회원 탈퇴',
  dangerDesc: '탈퇴하면 30일 동안 복구할 수 있고, 이후에는 데이터가 삭제돼요.',
  nameLabel: '이름',
  emailLabel: '이메일',
  joinedLabel: '가입일',
  edit: '수정',
  cancel: '취소',
  save: '저장',
  changeEmail: '이메일 변경',
  changePassword: '비밀번호 변경',
  withdraw: '회원 탈퇴',
  loading: '불러오는 중…',
  nameTooShort: '이름을 입력해 주세요.',
  invalidEmail: '올바른 이메일 형식이 아니에요.',
  needCurrentPass: '이메일 변경 시 비밀번호가 필요해요.',
  passTooShort: '비밀번호는 8자 이상이어야 해요.',
  passMismatch: '새 비밀번호가 서로 달라요.',
  passSameAsCurrent: '새 비밀번호는 현재 비밀번호와 달라야 해요.',
  saveOk: '이름이 변경됐어요.',
  emailOk: '이메일이 변경됐어요. 새 이메일로 다시 로그인해 주세요.',
  passOk: '비밀번호가 변경됐어요.',
  withdrawOk: '탈퇴가 요청됐어요. 30일 안에 다시 로그인하면 복구할 수 있어요.',
  genericFail: '요청에 실패했어요.',
  emailSame: '현재 이메일과 같아요.',
  emailModalTitle: '이메일 변경',
  emailModalDesc:
    '새 이메일과 현재 비밀번호를 입력해 주세요. 변경 후에는 다시 로그인해야 해요.',
  newEmailLabel: '새 이메일',
  currentPassLabel: '현재 비밀번호',
  passModalTitle: '비밀번호 변경',
  passModalDesc: '현재 비밀번호를 확인한 뒤 새 비밀번호(8자 이상)로 바꿔요.',
  passwordNew: '새 비밀번호',
  passwordConfirm: '새 비밀번호 확인',
  withdrawStep1Title: '정말 탈퇴하시겠어요?',
  withdrawStep1Desc: [
    '탈퇴 후 30일 안에 다시 로그인하면 계정을 복구할 수 있어요.',
    '30일이 지나면 계정과 수업 기록이 삭제돼요.',
  ],
  withdrawContinue: '계속',
  withdrawStep2Title: '비밀번호를 확인해 주세요',
  withdrawStep2Desc: '본인 확인을 위해 현재 비밀번호를 입력해 주세요.',
  withdrawAction: '탈퇴하기',
} as const

export type WithdrawStep = null | 'confirm' | 'password'

export function initialFrom(name: string): string {
  const t = name?.trim() ?? ''
  if (!t) return '?'
  return t.charAt(0).toUpperCase()
}

export function extractErrorMessage(e: unknown, fallback: string): string {
  const err = e as {
    response?: { data?: { error?: { message?: string }; message?: string } }
  }
  return err?.response?.data?.error?.message || err?.response?.data?.message || fallback
}

export function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
}
