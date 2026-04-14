'use client'

export default function TimerIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="30" cy="32" r="18" stroke="currentColor" strokeWidth="2.5" />
      <path d="M30 22V32L36 38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 10H36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M30 10V14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
