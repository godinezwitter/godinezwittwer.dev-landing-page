import { useCallback, useEffect, useRef, useState } from "react"

type HCaptchaAPI = {
  render: (container: HTMLElement, params: Record<string, unknown>) => string
  reset: (id?: string) => void
  remove: (id: string) => void
  getResponse: (id?: string) => string
}

declare global {
  interface Window {
    hcaptcha?: HCaptchaAPI
    onHCaptchaLoad?: () => void
  }
}

const API_SRC = "https://js.hcaptcha.com/1/api.js?render=explicit&onload=onHCaptchaLoad"
let loader: Promise<HCaptchaAPI> | null = null

/** Load the hCaptcha script once, shared across every caller. */
function loadHCaptcha(): Promise<HCaptchaAPI> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"))
  if (window.hcaptcha) return Promise.resolve(window.hcaptcha)
  if (loader) return loader
  loader = new Promise<HCaptchaAPI>((resolve, reject) => {
    window.onHCaptchaLoad = () => {
      if (window.hcaptcha) resolve(window.hcaptcha)
      else reject(new Error("hCaptcha loaded without an API"))
    }
    const s = document.createElement("script")
    s.src = API_SRC
    s.async = true
    s.defer = true
    s.onerror = () => reject(new Error("hCaptcha script failed to load"))
    document.head.appendChild(s)
  })
  return loader
}

/**
 * Renders a visible hCaptcha checkbox into `containerRef` and tracks its
 * single-use token. `enabled` is false when no sitekey is configured — the
 * caller should then skip the captcha check entirely. Call `reset()` after every
 * submit attempt, since a token can only be verified once.
 *
 * `sitekey` comes from `VITE_HCAPTCHA_SITEKEY`; it must match the sitekey shown
 * in the Web3Forms dashboard when hCaptcha spam protection is turned on there.
 *
 * `size` picks the widget layout: the default "normal" checkbox is a fixed
 * ~303px wide, which is wider than a phone-width form panel, so narrow screens
 * ask for "compact" (~164px). Changing it re-renders the widget, which drops any
 * token already collected — that's correct, since the old widget is gone.
 */
export function useHCaptcha(sitekey: string | undefined, size: "normal" | "compact" = "normal") {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const [token, setToken] = useState("")

  useEffect(() => {
    if (!sitekey) return
    let cancelled = false
    loadHCaptcha()
      .then((hc) => {
        if (cancelled || !containerRef.current || widgetId.current !== null) return
        widgetId.current = hc.render(containerRef.current, {
          sitekey,
          size,
          callback: (t: string) => setToken(t),
          "expired-callback": () => setToken(""),
          "error-callback": () => setToken(""),
        })
      })
      .catch(() => {
        /* offline / blocked — submit path surfaces the failure */
      })
    return () => {
      cancelled = true
      const id = widgetId.current
      widgetId.current = null
      if (id !== null && window.hcaptcha) {
        try {
          window.hcaptcha.remove(id)
        } catch {
          /* widget already torn down with its container */
        }
      }
      setToken("")
    }
  }, [sitekey, size])

  const reset = useCallback(() => {
    setToken("")
    if (window.hcaptcha && widgetId.current !== null) window.hcaptcha.reset(widgetId.current)
  }, [])

  return { containerRef, token, reset, enabled: Boolean(sitekey) }
}
