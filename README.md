# Room to Grow — IHG Growth Navigator

Interactive career-growth navigator for the IHG **Room to Grow** campaign:
a React app delivered as a single HTML document for the client intranet.
All copy ships with the build — there is no CMS or backend.

## Repo layout (pnpm workspaces)

| Path       | Package             | What it is                                                          |
| ---------- | ------------------- | ------------------------------------------------------------------- |
| `apps/web` | `@room-to-grow/web` | The frontend: React 19 + TypeScript + Vite + Tailwind 4 + shadcn/ui |

## Quick start

```bash
pnpm install
pnpm dev           # http://localhost:5173
```

## Builds

```bash
pnpm build         # standard multi-asset build → apps/web/dist
pnpm build:embed   # single self-contained HTML file → apps/web/dist-embed/index.html
```

`build:embed` inlines all JS/CSS/fonts/images into one `index.html` for
intranet drop-in.

## Content

Campaign copy lives in `apps/web/src/data/contentModel.ts`, taken from IHG's
"Room to Grow Landing Page Content" sheet (the "Updated copy" column). To
change copy, edit that file and rebuild. Role and programme ids must match
the map topology (`apps/web/src/data/mapTopology.ts`).

UI chrome strings (buttons, labels) are in `apps/web/src/i18n/strings.ts` in
en/fr/es/ar; the campaign copy itself is English only.

## Branding

Colors, radii and fonts are CSS design tokens in `apps/web/src/index.css`
(IHG University palette from the website design); components never
reference raw colors. Brand photography, the logo and the shield line art
are in `apps/web/src/assets/brand` and `apps/web/src/components/brand`.

## Docs

- `WEBSITE-RUNDOWN.md` — exhaustive description of the wireframe behaviour
- `SITE-BREAKDOWN.md` — earlier structural breakdown
