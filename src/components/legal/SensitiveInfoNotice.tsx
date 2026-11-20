import Text from '@/components/common/Text'

export const SENSITIVE_INFO_NOTICE =
  '주민등록번호, 건강 정보, 가정환경, 종교, 성적 지향, 정치 성향, 범죄 이력은 적지 마세요.'

export default function SensitiveInfoNotice() {
  return (
    <Text variant="labelSm" color="gray500" as="p">
      {SENSITIVE_INFO_NOTICE}
    </Text>
  )
}
