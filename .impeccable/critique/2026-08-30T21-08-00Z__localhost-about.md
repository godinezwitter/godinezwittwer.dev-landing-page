---
target: /about page
total_score: 19
max_score: 24
na_heuristics: 5,7,9,10
p0_count: 1
p1_count: 2
timestamp: 2026-08-30T21-08-00Z
slug: localhost-about
---
# Design Critique — About Us page (/about)

Method: dual-agent (A: design review · B: detector + browser evidence)

## Design Health Score

Mode: Persuade. Heuristics 5, 7, 9, 10 are n/a (no inputs, no accelerators, no error states, page is its own explanation). Scale /24.

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Active tab has sliding pill + aria-current; LinkedIn tiles give no resting affordance. |
| 2 | Match System / Real World | 4 | Human, jargon-light copy; real tech names; idiomatic DE. |
| 3 | User Control and Freedom | 3 | Back-to-Work is one click, but no forward/convert path on the page. |
| 4 | Consistency and Standards | 3 | Icon-only LinkedIn amid text links; identical role label on two differentiated founders. |
| 5 | Error Prevention | n/a | No inputs. |
| 6 | Recognition Rather Than Recall | 3 | Tech pills/initials aid recognition; the `in` glyph asks recall. |
| 7 | Flexibility and Efficiency | n/a | Marketing surface. |
| 8 | Aesthetic and Minimalist Design | 3 | Clean but tips into thin — under-furnished for a full-height route. |
| 9 | Error Recovery | n/a | No error states. |
| 10 | Help and Documentation | n/a | The page is the explanation. |
| Total | | 19/24 | Good (79%) |

## Design Specificity Verdict

Voice is unmistakably this studio; layout is anyone's team page. ~60% authored, 40% template — the template half (the founder-card composition: avatar → name → role → bio → pills → hobby line, twice side by side) is what a visitor notices first. Authored: the copy, fully-localized German, the Fraunces headline with wine <em>, initials tiles rhyming with the nav monogram. For a studio pitching "we sweat craft," the About page is its least crafted-looking surface.

Deterministic scan (B): detect.mjs on all five component files → clean, 0 findings (exit 0). Console clean; historic removeChild crash confirmed gone. No overlay injected (CLI clean).

## What's Working
1. The headline system (Fraunces, textWrap balance, one wine <em> on the verb) — the page's brand anchor.
2. Disciplined honesty visible in the design — no fake headshots/stats/logos; initials tiles tie to the nav monogram.
3. Genuinely equal bilingual craft; ScrollRevealText re-keys on t.about.intro for clean language switch.

## Priority Issues

[P0] The About page has no conversion path of its own. Peak-intent visitor dead-ends; nav CTA + footer Contact both route to /#contact on the other route. Fix: closing CTA band after the cards → /#contact (also fixes peak-end valley + emptiness). Command: /impeccable layout.

[P1] Too sparse for a full-height route; footer floats on tall screens. min-height:100vh + ~1132px content = dead space on tall monitors; double bottom spacer (Footer mt-16 + trailing h-16). Fix: add one mid-weight band (reuse hero.panel values copy); drop h-16. Command: /impeccable layout.

[P1] Nav labels + hobby line fail WCAG AA contrast on light bg. Nav pill rgba(18,6,10,0.7) over light paper → inactive-tab ink-muted #b89aa0 computes 3.12:1 (needs 4.5:1). Hobby line ink-soft @opacity:0.8 ≈3.9:1. Fix: darken inactive label token / opaque pill at top; drop opacity:0.8. Command: /impeccable audit.

[P2] Founder-card header wraps awkwardly on mobile; touch targets <44px. flex items-center gap-5 no mobile stack → name+role wrap at 375px. Hamburger 36×36, LinkedIn 40×40, footer links 16px tall. Fix: stack header below md; bump targets to ≥44px. Command: /impeccable adapt.

[P2] Role label contradicts the bios. Both "Full-stack engineer" though bios say front-end/motion vs design/back-end lead. Fix: promote lead descriptor into role slot or drop it. Command: /impeccable clarify.

## Persona Red Flags
- Jordan (first-timer): icon-only `in` tile no resting label; no in-body CTA after reading.
- Casey (mobile): card header wraps at 375px; ~250px dead gap before kicker; sub-44px targets.
- Sam (a11y): above average (aria-label, aria-pressed, aria-current, visible focus). Gaps: nav+hobby contrast; no <h1> (first heading is H2); footer not a <footer> landmark.

## Minor Observations
- Generic y:-4 card hover; perfectly symmetric cards (no intentional asymmetry); ScrollRevealText inert (immediate) on this route; monogram jumps to /#home; tech pills don't visually distinguish Joel's vs Dee's stack.

## Questions to Consider
1. If you deleted the initials tiles and kept only copy, would the page be worse?
2. Besides the headline, which section of this page "earns its place"?
3. Is /about a page, or the orphaned back-half of one?
