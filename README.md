# Godinez Wittwer — Landing Page

Business landing page. Built with Vite, React, TypeScript, and Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

## Workflow

- `main` is protected — no direct pushes.
- Create a branch per change: `feature/...`, `fix/...`.
- Open a pull request; it needs one approval from the other maintainer before merging.
- CI (`.github/workflows/ci.yml`) lints and builds every PR.

## UI component sources (optional)

Two integrations for pulling in ready-made components. Neither is needed to run
or build the site — set them up only if you want them.

**shadcn MCP** — configured in `.mcp.json`, so it is shared with the repo. Claude
Code asks once per machine to trust the project's MCP servers; approve it there
and it works, no key or account needed. `components.json` registers the
`@react-bits` registry alongside it, so React Bits components resolve too
(e.g. "add the Dither background from React Bits").

**21st.dev** — add it as a connector in your claude.ai connector settings. That
route handles auth for you; there is deliberately no 21st entry in `.mcp.json`,
since the project-scoped alternative would need every developer to generate an
API key and set `API_KEY_21ST` themselves.

Note: the install commands 21st.dev returns look like
`npx shadcn@latest add "https://21st.dev/r/...?api_key=$API_KEY_21ST"`. Those
still need `API_KEY_21ST` in your environment. The connector alone covers
searching and reading component code, not that CLI install path.

## Scripts

| Command           | Description              |
| ------------------ | ------------------------ |
| `npm run dev`       | Start local dev server   |
| `npm run build`     | Type-check and build     |
| `npm run lint`      | Lint the codebase        |
| `npm run preview`   | Preview production build |
