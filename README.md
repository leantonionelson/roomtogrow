# Room to Grow — IHG Growth Navigator

Interactive career-growth navigator for the IHG **Room to Grow** campaign.
Evolving from wireframe prototype to product: a React app delivered as a
single HTML document for the client intranet, with content managed in a
separately hosted [Payload CMS](https://payloadcms.com/).

## Repo layout (pnpm workspaces)

| Path       | Package              | What it is                                                        |
| ---------- | -------------------- | ----------------------------------------------------------------- |
| `apps/web` | `@room-to-grow/web`  | The frontend: React 19 + TypeScript + Vite + Tailwind 4 + shadcn/ui |
| `apps/cms` | `@room-to-grow/cms`  | Payload 3 (Next.js) with the campaign content schema, SQLite in dev |

## Quick start

```bash
pnpm install

# CMS (admin at http://localhost:3000/admin)
pnpm dev:cms
pnpm --filter @room-to-grow/cms seed   # first run: seed placeholder content

# Frontend (http://localhost:5173)
pnpm dev
```

The frontend reads `VITE_CMS_URL` (see `apps/web/.env.example`). When the CMS
is unreachable — or the variable is unset — it renders from the built-in
fallback content in `apps/web/src/data/contentModel.ts`, so the page always
works.

## Builds

```bash
pnpm build         # standard multi-asset build → apps/web/dist
pnpm build:embed   # single self-contained HTML file → apps/web/dist-embed/index.html
pnpm build:cms     # production build of the CMS
```

`build:embed` inlines all JS/CSS/fonts into one `index.html` for intranet
drop-in. Set `VITE_CMS_URL` at build time to point it at the hosted CMS.

## Content model

Collections: `roles`, `personas`, `programmes`, `stories`, `faqs` — keyed by
`slug`, which must match the ids used by the map topology
(`apps/web/src/data/mapTopology.ts`). Global: `site-copy` (strapline, intro,
intent selector, selling points, manager guidance, path-AI copy, persona
qualifier). All content is public-read; writes require an admin user.

Seed data (`apps/cms/src/seed/seed-data.json`) is generated from the
frontend's fallback content so the two stay in step.

## Branding

The UI is built on shadcn/ui with a neutral placeholder palette. All colors,
radii, and fonts are CSS design tokens in `apps/web/src/index.css` — rebrand
by swapping the token values there when IHG brand assets arrive; components
never reference raw colors.

## Docs

- `WEBSITE-RUNDOWN.md` — exhaustive description of the wireframe behaviour
- `SITE-BREAKDOWN.md` — earlier structural breakdown
