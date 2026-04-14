import { TextareaHTMLAttributes } from 'react'
import { textareaStyle } from './Textarea.css'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
}

export default function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={`${textareaStyle}${className ? ` ${className}` : ''}`}
      {...props}
    />
  )
}