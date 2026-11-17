import { readFileSync } from 'node:fs'
import path from 'node:path'
import Link from 'next/link'
import { backStyle, bodyStyle, innerStyle, pageStyle, titleStyle } from './legal.css'

export function LegalDocument({ title, file }: { title: string; file: string }) {
  const text = readFileSync(path.join(process.cwd(), 'src/content/legal', file), 'utf8')
  return (
    <main className={pageStyle}>
      <div className={innerStyle}>
        <Link href="/signup" className={backStyle}>가입으로 돌아가기</Link>
        <h1 className={titleStyle}>{title}</h1>
        <pre className={bodyStyle}>{text}</pre>
      </div>
    </main>
  )
}
