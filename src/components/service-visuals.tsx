/** Glossy glass-and-chrome service illustrations, hand-built as SVG so they stay
 * crisp at any size, sit exactly on the wine/rose/chrome brand palette, and read
 * on paper, wine, and dark card backgrounds alike. One shared visual grammar:
 * a burgundy-glass body, a chrome rim, a soft rose float-glow, and a white
 * specular highlight lit from the top-left. */

import type { ReactElement } from "react"

type Props = { index: number; className?: string }

/** Shared gradient + filter defs, id-prefixed per instance so multiple visuals
 * can coexist on one page without id collisions. */
function Defs({ p }: { p: string }) {
  return (
    <defs>
      <linearGradient id={`${p}-glass`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f7cdd9" />
        <stop offset="0.32" stopColor="#e0567f" />
        <stop offset="0.68" stopColor="#b8305c" />
        <stop offset="1" stopColor="#7c1e3c" />
      </linearGradient>
      <linearGradient id={`${p}-glass-soft`} x1="0" y1="0" x2="0.6" y2="1">
        <stop offset="0" stopColor="#f2b8ca" />
        <stop offset="1" stopColor="#c23e64" />
      </linearGradient>
      <linearGradient id={`${p}-chrome`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.45" stopColor="#d7dae0" />
        <stop offset="0.75" stopColor="#a9adb6" />
        <stop offset="1" stopColor="#7f838d" />
      </linearGradient>
      <radialGradient id={`${p}-spec`} cx="0.3" cy="0.24" r="0.55">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${p}-glow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#e0567f" stopOpacity="0.5" />
        <stop offset="1" stopColor="#e0567f" stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

/** Per-object geometry. Each returns the shapes drawn over the shared glow. */
const SHAPES: Record<number, (p: string) => ReactElement> = {
  // 0 — Landing page: a floating browser card
  0: (p) => (
    <g>
      <rect x="46" y="58" width="148" height="118" rx="16" fill={`url(#${p}-glass)`} stroke={`url(#${p}-chrome)`} strokeWidth="4" />
      <path d="M46 84h148" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="3" />
      <circle cx="62" cy="71" r="3.4" fill="#ffffff" fillOpacity="0.85" />
      <circle cx="74" cy="71" r="3.4" fill="#ffffff" fillOpacity="0.55" />
      <circle cx="86" cy="71" r="3.4" fill="#ffffff" fillOpacity="0.4" />
      <rect x="62" y="98" width="70" height="10" rx="5" fill="#ffffff" fillOpacity="0.8" />
      <rect x="62" y="116" width="104" height="7" rx="3.5" fill="#ffffff" fillOpacity="0.4" />
      <rect x="62" y="131" width="88" height="7" rx="3.5" fill="#ffffff" fillOpacity="0.32" />
      <rect x="62" y="150" width="46" height="16" rx="8" fill={`url(#${p}-chrome)`} />
      <ellipse cx="92" cy="84" rx="60" ry="26" fill={`url(#${p}-spec)`} opacity="0.55" />
    </g>
  ),
  // 1 — Copywriting: a fountain-pen nib with a cursor bar
  1: (p) => (
    <g>
      <rect x="150" y="64" width="12" height="112" rx="6" fill={`url(#${p}-glass-soft)`} />
      <rect x="150" y="64" width="12" height="46" rx="6" fill="#ffffff" fillOpacity="0.55" />
      <path d="M92 44l40 40-58 92-30 8 8-30z" fill={`url(#${p}-glass)`} stroke={`url(#${p}-chrome)`} strokeWidth="4" strokeLinejoin="round" />
      <path d="M92 44l40 40-14 14-40-40z" fill={`url(#${p}-chrome)`} />
      <path d="M78 132l24 24-24 6-6-24z" fill="#7c1e3c" />
      <path d="M84 138l12 12" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="104" cy="74" rx="30" ry="14" transform="rotate(45 104 74)" fill={`url(#${p}-spec)`} opacity="0.6" />
    </g>
  ),
  // 2 — Fiverr gig pages: a price tag with a star
  2: (p) => (
    <g>
      <path d="M58 66h62l64 64-58 58-64-64V66z" fill={`url(#${p}-glass)`} stroke={`url(#${p}-chrome)`} strokeWidth="4" strokeLinejoin="round" />
      <circle cx="88" cy="96" r="12" fill={`url(#${p}-chrome)`} />
      <circle cx="88" cy="96" r="5" fill="#7c1e3c" />
      <path d="M138 116l6.2 12.6 13.8 2-10 9.8 2.4 13.8-12.4-6.5-12.4 6.5 2.4-13.8-10-9.8 13.8-2z" fill="#ffffff" fillOpacity="0.9" />
      <ellipse cx="96" cy="92" rx="40" ry="18" transform="rotate(45 96 92)" fill={`url(#${p}-spec)`} opacity="0.5" />
    </g>
  ),
  // 3 — Full website builds: stacked offset layers
  3: (p) => (
    <g>
      <rect x="60" y="118" width="128" height="46" rx="12" fill="#7c1e3c" />
      <rect x="52" y="96" width="128" height="46" rx="12" fill={`url(#${p}-glass-soft)`} stroke={`url(#${p}-chrome)`} strokeWidth="3" />
      <rect x="44" y="66" width="128" height="52" rx="14" fill={`url(#${p}-glass)`} stroke={`url(#${p}-chrome)`} strokeWidth="4" />
      <rect x="58" y="80" width="52" height="9" rx="4.5" fill="#ffffff" fillOpacity="0.85" />
      <rect x="58" y="96" width="84" height="6" rx="3" fill="#ffffff" fillOpacity="0.4" />
      <ellipse cx="92" cy="80" rx="54" ry="16" fill={`url(#${p}-spec)`} opacity="0.5" />
    </g>
  ),
  // 4 — Page refresh & audit: a magnifying glass
  4: (p) => (
    <g>
      <rect x="150" y="150" width="46" height="20" rx="10" transform="rotate(45 150 150)" fill={`url(#${p}-chrome)`} />
      <circle cx="106" cy="106" r="52" fill={`url(#${p}-glass)`} stroke={`url(#${p}-chrome)`} strokeWidth="7" />
      <circle cx="106" cy="106" r="52" fill="none" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2" />
      <ellipse cx="90" cy="88" rx="26" ry="16" transform="rotate(-30 90 88)" fill={`url(#${p}-spec)`} opacity="0.75" />
    </g>
  ),
  // 5 — Brand identity: a fanned arc of colour swatches
  5: (p) => (
    <g transform="rotate(-8 120 120)">
      <rect x="66" y="70" width="30" height="104" rx="12" fill="#7c1e3c" transform="rotate(-18 81 122)" />
      <rect x="96" y="66" width="30" height="108" rx="12" fill="#b8305c" transform="rotate(-6 111 120)" />
      <rect x="126" y="66" width="30" height="108" rx="12" fill="#e0567f" transform="rotate(6 141 120)" />
      <rect x="156" y="70" width="30" height="104" rx="12" fill="#f2b8ca" transform="rotate(18 171 122)" />
      <rect x="96" y="66" width="30" height="40" rx="12" fill="#ffffff" fillOpacity="0.4" transform="rotate(-6 111 120)" />
      <ellipse cx="120" cy="92" rx="52" ry="18" fill={`url(#${p}-spec)`} opacity="0.4" />
    </g>
  ),
}

/** One glossy service object. `index` picks the shape (0–5). */
export function ServiceVisual({ index, className }: Props) {
  const p = `sv${index}`
  const shape = SHAPES[index] ?? SHAPES[0]
  return (
    <svg viewBox="0 0 240 240" className={className} fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <Defs p={p} />
      <ellipse cx="118" cy="128" rx="98" ry="98" fill={`url(#${p}-glow)`} />
      {shape(p)}
    </svg>
  )
}
