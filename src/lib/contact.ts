/**
 * Contact-form delivery via Web3Forms (https://web3forms.com) — a static-site
 * form-to-email relay, so no backend of our own.
 *
 * Submissions land in the inbox of the account the access key belongs to
 * (godinezwittwer.dev@gmail.com). The key is publishable — it only permits
 * POSTing to that one form, and Web3Forms spam-filters on top of the honeypot —
 * but it's read from an env var (`VITE_WEB3FORMS_ACCESS_KEY`) so it isn't
 * committed. Set it in `.env` locally and as a build variable on the host / CI.
 * With no key the send fails closed and the caller shows the fallback message.
 */

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
const ENDPOINT = "https://api.web3forms.com/submit"

export type ContactPayload = {
  name: string
  email: string
  service: string
  message: string
  /** Honeypot — real users never touch it; a non-empty value means a bot. */
  botcheck: string
  /** hCaptcha token — required only when hCaptcha is enabled for the Web3Forms
   *  form; omitted otherwise. */
  hcaptcha?: string
}

/** POST the brief to Web3Forms. Resolves on a confirmed send, throws otherwise
 *  (missing key, network failure, or a non-success response) so the caller can
 *  show the "email us directly" fallback. */
export async function sendContactForm(payload: ContactPayload): Promise<void> {
  if (!ACCESS_KEY) {
    throw new Error("VITE_WEB3FORMS_ACCESS_KEY is not set — the contact form has no delivery target.")
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      subject: `New brief from ${payload.name.trim() || "a visitor"} — godinezwittwer.dev`,
      from_name: "godinezwittwer.dev",
      // Web3Forms threads replies to this address.
      replyto: payload.email,
      name: payload.name,
      email: payload.email,
      "Fiverr category": payload.service.trim() || "—",
      message: payload.message.trim() || "—",
      botcheck: payload.botcheck,
      // Web3Forms verifies this server-side when hCaptcha is enabled for the form.
      ...(payload.hcaptcha ? { "h-captcha-response": payload.hcaptcha } : {}),
    }),
  })

  const data = (await res.json().catch(() => null)) as { success?: boolean } | null
  if (!res.ok || !data?.success) {
    throw new Error(`Web3Forms rejected the submission (HTTP ${res.status}).`)
  }
}
