export const LESSON_ALIMTALK_FRAME_HEADER =
  '안녕하세요. {학원명} {강사명}입니다.\n{학생이름} 학생의 {수업일} 수업 결과를 안내드립니다.'

export const LESSON_ALIMTALK_FRAME_FOOTER = '자세한 내용은 아래 링크에서 확인해주세요.'

export const LESSON_ALIMTALK_CTA_LABEL = '학습 대시보드 보기'

export function fillLessonAlimtalkFrameHeader(vars: {
  academyName: string
  teacherName: string
  studentName: string
  lessonDate: string
}): string {
  return LESSON_ALIMTALK_FRAME_HEADER.replaceAll('{학원명}', vars.academyName)
    .replaceAll('{강사명}', vars.teacherName)
    .replaceAll('{학생이름}', vars.studentName)
    .replaceAll('{수업일}', vars.lessonDate)
}

/** 미리보기용: 카카오 고정 하단 문안과 겹치는 BE 링크 줄을 제거 */
export function stripParentDashboardPreviewLine(body: string): string {
  return body
    .replace(/^학부모 안내 링크:.*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
