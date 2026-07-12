'use client'

export function SuccessCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="40" cy="40" r="40" fill="#3B51CC" />
      <path
        d="M23 41.5 L34.5 53 L57 28"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ClosedWarningIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="40" cy="40" r="40" fill="#E5E6EC" />
      <path
        d="M40 24v28M40 56v2"
        stroke="#5B5C72"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}
