import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { legalLinks, type LegalDocId } from '@/content/legal/business'
import BusinessInfo from './BusinessInfo'
import { parseLegal, type LegalBlock } from './parseLegal'
import * as styles from './legal.css'

const URL_PATTERN = /https?:\/\/[^\s)]+|www\.[^\s),]+|privacy\.kisa\.or\.kr|ecm\.police\.go\.kr|policies\.google\.com\/privacy/g

function RichText({ text }: { text: string }) {
  const nodes: ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(URL_PATTERN)) {
    const value = match[0]
    const start = match.index ?? 0
    if (start > last) nodes.push(text.slice(last, start))
    const href = value.startsWith('http') ? value : `https://${value}`
    nodes.push(
      <a key={`${start}-${value}`} href={href} className={styles.linkStyle}>
        {value}
      </a>,
    )
    last = start + value.length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return <>{nodes}</>
}

function Blocks({ blocks }: { blocks: LegalBlock[] }) {
  return blocks.map((block, index) => {
    if (block.type === 'h2') {
      return (
        <h2 key={block.id} id={block.id} className={styles.h2Style}>
          {block.text}
        </h2>
      )
    }
    if (block.type === 'h3') {
      return (
        <h3 key={block.id} id={block.id} className={styles.h3Style}>
          {block.text}
        </h3>
      )
    }
    if (block.type === 'p') {
      return (
        <p key={`p-${index}`} className={styles.paragraphStyle}>
          <RichText text={block.text} />
        </p>
      )
    }
    if (block.type === 'ul') {
      return (
        <ul key={`ul-${index}`} className={styles.listStyle}>
          {block.items.map((item) => (
            <li key={item}>
              <RichText text={item} />
            </li>
          ))}
        </ul>
      )
    }
    if (block.type === 'ol') {
      return (
        <ol key={`ol-${index}`} className={styles.listStyle}>
          {block.items.map((item) => (
            <li key={item.text}>
              <RichText text={item.text} />
              {item.children.length > 0 ? (
                <ul className={styles.nestedListStyle}>
                  {item.children.map((child) => (
                    <li key={child}>
                      <RichText text={child} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ol>
      )
    }
    return (
      <div key={`table-${index}`} className={styles.tableWrapStyle}>
        <table className={styles.tableStyle}>
          <thead>
            <tr>
              {block.headers.map((header) => (
                <th key={header} className={styles.thStyle}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row) => (
              <tr key={row.join('|')}>
                {row.map((cell, cellIndex) => (
                  <td key={`${cell}-${cellIndex}`} className={styles.tdStyle}>
                    <RichText text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  })
}

export function LegalDocument({ file, current }: { file: string; current: LegalDocId }) {
  const text = readFileSync(path.join(process.cwd(), 'src/content/legal', file), 'utf8')
  const doc = parseLegal(text)
  const toc = doc.blocks.filter((block) => block.type === 'h2')
  const outline = toc.length > 1 ? toc : doc.blocks.filter((block) => block.type === 'h3')

  return (
    <main className={styles.pageStyle}>
      <header className={styles.topbarStyle}>
        <Link href="/" aria-label="클랫 홈" className={styles.logoLinkStyle}>
          <Image src="/images/logo.png" alt="클랫" width={96} height={28} className={styles.logoStyle} />
        </Link>
        <nav className={styles.navStyle} aria-label="약관">
          {legalLinks.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={styles.navLinkStyle}
              aria-current={item.id === current ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className={styles.innerStyle}>
        <article className={styles.sheetStyle}>
          {doc.effectiveDate ? <p className={styles.dateStyle}>시행일 {doc.effectiveDate}</p> : null}
          <h1 className={styles.titleStyle}>{doc.title}</h1>
          {outline.length > 0 ? (
            <nav className={styles.tocStyle} aria-label="목차">
              <p className={styles.tocLabelStyle}>목차</p>
              <ol className={styles.tocListStyle}>
                {outline.map((item) =>
                  item.type === 'h2' || item.type === 'h3' ? (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className={styles.tocLinkStyle}>
                        {item.text}
                      </a>
                    </li>
                  ) : null,
                )}
              </ol>
            </nav>
          ) : null}
          <Blocks blocks={doc.blocks} />
          <div className={styles.footerBlockStyle}>
            <BusinessInfo tone="light" />
          </div>
        </article>
      </div>
    </main>
  )
}
