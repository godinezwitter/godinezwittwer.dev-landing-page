/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Web3Forms access key for the contact form. Publishable — it only permits
   *  submitting to the form bound to godinezwittwer.dev@gmail.com. Set in `.env`. */
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string
  /** hCaptcha sitekey — set only when hCaptcha spam protection is enabled in the
   *  Web3Forms dashboard. Must match the sitekey shown there. Blank = no captcha. */
  readonly VITE_HCAPTCHA_SITEKEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
