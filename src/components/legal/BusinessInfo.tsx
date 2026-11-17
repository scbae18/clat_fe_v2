import Link from 'next/link'
import { business, legalLinks } from '@/content/legal/business'
import * as styles from './BusinessInfo.css'

export default function BusinessInfo({ tone }: { tone: 'light' | 'dark' }) {
  return (
    <address className={styles.block({ tone })}>
      <nav className={styles.links} aria-label="약관">
        {legalLinks.map((item) => (
          <Link key={item.href} href={item.href} className={styles.link({ tone })}>
            {item.label}
          </Link>
        ))}
      </nav>
      <p>
        상호 {business.name} · 대표 {business.representative}
      </p>
      <p>{business.address}</p>
      <p>
        <a href={`tel:${business.phoneTel}`} className={styles.contact({ tone })}>
          {business.phone}
        </a>
        {' · '}
        <a href={`mailto:${business.email}`} className={styles.contact({ tone })}>
          {business.email}
        </a>
      </p>
      <p>사업자등록번호 {business.registrationNumber}</p>
      <p>호스팅 {business.hosting}</p>
      <p>개인정보 보호책임자 {business.privacyOfficer}</p>
      <p>{business.mailOrderNote}</p>
    </address>
  )
}
