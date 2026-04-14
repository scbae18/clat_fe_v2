import Text from '@/components/common/Text'
import Input from '@/components/common/Input'
import { sectionStyle } from './TemplateName.css'

interface TemplateNameProps {
  value: string
  onChange: (value: string) => void
  hasError?: boolean
}

export default function TemplateNameSection({ value, onChange, hasError }: TemplateNameProps) {
  return (
    <div className={sectionStyle}>
      <Text variant="headingMd" as="h2">
        템플릿 이름 <span style={{ color: '#EF4453' }}>*</span>
      </Text>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="예) 정규 수업 템플릿"
        hasError={hasError}
      />
    </div>
  )
}