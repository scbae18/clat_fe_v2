'use client'

import BusinessInfo from '@/components/legal/BusinessInfo'
import Reveal from '@/components/motion/Reveal'
import * as s from '@/app/landing.css'

export default function Footer() {
  return (
    <Reveal>
      <footer className={s.footer}>
        <div className={s.container}>
          <div className={s.footerBody}>
            <BusinessInfo tone="dark" />
            <p className={s.footerText}>© {new Date().getFullYear()} 클랫</p>
          </div>
        </div>
      </footer>
    </Reveal>
  )
}
