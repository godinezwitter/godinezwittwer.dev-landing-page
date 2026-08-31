import { useSyncExternalStore } from "react"
import { scrollToTarget } from "@/components/SmoothScroll"

/* A minimal pathname router. The site has just two views — the main studio page
   ("/") and the About page ("/about") — so a dependency-free History-API router
   keeps the bundle lean and plays nicely with the existing Lenis + GSAP scroll
   machinery. Cross-page anchor links (e.g. the CTA → "/#contact") are handled by
   the destination page reading the hash on mount; same-page hashes scroll here. */

const NAV_EVENT = "gw:navigate"

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback)
  window.addEventListener(NAV_EVENT, callback)
  return () => {
    window.removeEventListener("popstate", callback)
    window.removeEventListener(NAV_EVENT, callback)
  }
}

/** Current route (pathname). Re-renders subscribers on push/pop navigation. */
export function useRoute(): string {
  return useSyncExternalStore(
    subscribe,
    () => window.location.pathname,
    () => "/",
  )
}

/** Navigate to an in-app URL (path and/or hash), e.g. "/", "/about", "/#contact". */
export function navigate(to: string) {
  const url = new URL(to, window.location.origin)
  const samePath = url.pathname === window.location.pathname

  if (samePath && url.hash && url.hash === window.location.hash) {
    // Already here — just re-scroll to the anchor.
    scrollToTarget(url.hash)
    return
  }

  window.history.pushState({}, "", url)
  window.dispatchEvent(new Event(NAV_EVENT))

  if (samePath && url.hash) {
    // The target element is already mounted; scroll after the next paint.
    requestAnimationFrame(() => scrollToTarget(url.hash))
  }
  // Cross-page scrolling (to a hash, or to the top) is handled by the destination
  // page on mount, once its content is actually in the DOM.
}
