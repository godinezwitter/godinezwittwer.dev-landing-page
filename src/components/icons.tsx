/** Small drawn icons shared across sections — matches the stroke/weight of the
 * Services icon set so nothing falls back to a unicode glyph. */

export function CheckIcon({ className, size = 12 }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export function StarIcon({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.5l2.9 5.87 6.48.94-4.69 4.57 1.11 6.45L12 17.77l-5.8 3.05 1.1-6.45L2.62 9.8l6.48-.94z" />
    </svg>
  )
}
