import { Component, type ReactNode } from "react"
import { detectInitial } from "@/i18n/language"
import { translations } from "@/i18n/translations"

type Props = { children: ReactNode }
type State = { hasError: boolean }

/** Last-resort safety net: without this, an uncaught error anywhere in the
 * tree (a stray DOM race with a third-party animation library, for example)
 * unmounts the entire app and leaves a blank screen with no way to recover
 * short of a manual reload. This catches it and offers a reload instead. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error("Uncaught error in app tree:", error)
  }

  render() {
    if (this.state.hasError) {
      // Rendered above LanguageProvider, so read the locale straight from
      // storage / browser preference rather than context.
      const copy = translations[detectInitial()].error
      return (
        <div
          className="fixed inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center"
          style={{ background: "var(--color-paper)", color: "var(--color-ink-deep)" }}
        >
          <p className="font-body text-xl">{copy.title}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: "var(--color-wine)", color: "#fff" }}
          >
            {copy.reload}
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
