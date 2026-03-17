# Room to Grow — Technical & Strategic Breakdown

Exhaustive technical and strategic documentation of the **Room to Grow** site (IHG Growth Navigator wireframe).

---

## 1. Executive Summary

**Room to Grow** is a single-page React application that presents **IHG University** as the learning and career-growth platform for IHG colleagues. It functions as a campaign/landing site with an interactive **Growth Navigator**: users choose a current role and destination role, see a visual route of steps (roles + programmes), and explore programmes and success stories. Optional **persona qualification** (quiz) and **leader mode** tailor the experience for individuals vs. people developing their teams.

- **Product name:** Room to Grow | IHG Growth Navigator  
- **Stack:** React 19, Vite 5, Tailwind CSS 3  
- **Content:** Fully driven by a single data module (`contentModel.js`); no backend or CMS.  
- **Deployment:** Static build (`dist/`) suitable for any static host.

---

## 2. Strategic Overview

### 2.1 Purpose & Goals

- **Primary:** Introduce IHG University and the “Room to Grow” concept; drive engagement with the Growth Navigator.
- **Secondary:** Qualify users by intent (persona) and role (current → destination) to tailor messaging; support both “I’m growing” and “I’m developing my team” flows.
- **Tactical:** Provide a clear, visual path from role to role via programmes; reduce friction with a single place for growth (“One place for growth”).

### 2.2 Target Audiences

| Audience | Mechanism | Experience |
|----------|-----------|------------|
| Individual contributors | “Start Exploring” + persona quiz (e.g. Pathfinders) | Self-focused copy; “what you will learn and how it helps your career.” |
| Managers / team developers | “I’m developing my team” (leader mode) or persona (Growth Guides, Future Builders, Promoters) | Leader-focused copy; “how to support your team / build pipeline / promote learning.” |
| All colleagues | Role dropdowns (From → To) + Find Route | Route steps (roles + programmes); Programme Explorer; success stories. |

### 2.3 Key Messaging

- **Strapline:** “Your room to grow. Your world of learning. IHG University.”
- **Intro:** IHG University helps colleagues grow and develop leadership; journey starts here whether taking the next step or supporting the team.
- **Selling points (Why Room to Grow):** Clear career pathways; learning linked to real roles; flexible learning; structured leadership development; one place for growth.

### 2.4 User Journeys

1. **Land → Explore:** Hero → “Start Exploring” → scroll to Growth Navigator → (optional) persona qualifier → choose From/To roles → Find Route → interact with route nodes, stories, programme cards.
2. **Leader path:** Hero → “I’m developing my team” → same navigator with leader-mode messaging in panels.
3. **Browse without route:** Open navigator → (optional) persona → scroll Programme Explorer carousel → click programme → panel/drawer shows programme details.

---

## 3. Technical Architecture

### 3.1 Technology Stack

| Layer | Technology | Version / Notes |
|-------|------------|------------------|
| Runtime | Browser (ES modules) | — |
| Framework | React | ^19.2.4 |
| DOM | react-dom | ^19.2.4 |
| Build | Vite | ^5.4.0 |
| React integration | @vitejs/plugin-react | ^4.3.4 |
| Styling | Tailwind CSS | ^3.4.0 |
| PostCSS | postcss, autoprefixer | ^8.5.8, ^10.4.27 |
| Linting | ESLint | ^9.39.4 (flat config) |
| Plugins | eslint-plugin-react-hooks, eslint-plugin-react-refresh | — |
| Types (dev) | @types/react, @types/react-dom | ^19.x |

- **Module system:** ESM (`"type": "module"` in `package.json`).  
- **No router:** Single page; no react-router or URL-based routes.  
- **No state library:** All state is React `useState` (and one `useRef`) in `App.jsx`.  
- **No backend/API:** All content and “routes” are from `src/data/contentModel.js`.

### 3.2 Project Structure

```
room-to-grow/
├── index.html                 # Entry HTML; root div; script /src/main.jsx
├── package.json
├── vite.config.js             # Vite + React plugin only
├── tailwind.config.js         # content: index.html, src/**/*.{js,ts,jsx,tsx}
├── postcss.config.js          # (if present) tailwind + autoprefixer
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── dist/                      # Production build output
└── src/
    ├── main.jsx               # React root; StrictMode; App
    ├── App.jsx                 # Root component; all global state & layout
    ├── index.css               # Tailwind directives + minimal global styles
    ├── data/
    │   └── contentModel.js     # Single source of truth for all copy & structure
    └── components/
        ├── Header.jsx
        ├── HeroVideoSection.jsx
        ├── IntroSection.jsx
        ├── Container.jsx
        ├── SellingPointsGrid.jsx
        ├── NavigatorControls.jsx
        ├── RouteSummaryBar.jsx
        ├── PersonaQualifier.jsx
        ├── MapCanvas.jsx
        ├── RouteNode.jsx
        ├── StoryPin.jsx
        ├── RoutePanel.jsx
        ├── MobileDrawer.jsx
        ├── ManagerSupportSection.jsx
        ├── FAQSection.jsx
        └── Footer.jsx
        # Alternative / unused components (not in App.jsx):
        ├── NavigatorSearchBar.jsx
        ├── TimeFilter.jsx
        ├── ProgrammeCards.jsx
        └── PersonaToggle.jsx
```

### 3.3 Entry & Data Flow

- **Entry:** `index.html` → `/src/main.jsx` → `createRoot(#root).render(<StrictMode><App /></StrictMode>)`.  
- **Styles:** `main.jsx` imports `./index.css` (Tailwind + overrides).  
- **Data:** Components import directly from `./data/contentModel.js` (constants and helpers: `getRoute`, `getProgrammeById`, `getStoryById`, `getRoleLabel`). No async loading, no environment-specific content.

---

## 4. Application State (App.jsx)

All global UI state lives in `App.jsx`:

| State | Type | Purpose |
|-------|------|--------|
| `leaderMode` | `boolean` | Set by “I’m developing my team”; drives panel copy (leader vs self). |
| `currentRoute` | `object \| null` | Result of `getRoute(fromRoleId, toRoleId)`; route with `steps`. |
| `selectedNodeId` | `string \| null` | ID of selected route step (role or programme node). |
| `selectedStoryId` | `string \| null` | ID of selected success story. |
| `selectedProgrammeId` | `string \| null` | ID of selected programme (from Programme Explorer). |
| `selectedPersonaId` | `string \| null` | Persona chosen via PersonaQualifier (or could be set elsewhere). |
| `mobileDrawerOpen` | `boolean` | Mobile drawer visibility (controls + RoutePanel). |
| `timeFilter` | `string` | One of: "10 minutes", "30 minutes", "1 hour", "Longer learning". |

**Refs:** `navigatorRef` — used to scroll to `#growth-navigator` when user clicks “Start Exploring” or “I’m developing my team”.

**Invariants (enforced in handlers):**  
Selecting a node clears story and programme; selecting a story clears node and programme; selecting a programme clears node and story. Finding a route sets `selectedNodeId` to the first step and opens the mobile drawer if a route exists.

---

## 5. Content Model (contentModel.js)

Single module that defines all copy, structure, and lookup logic. No side effects; pure data + functions.

### 5.1 Exported Constants

| Export | Shape | Use |
|--------|--------|-----|
| `strapline` | `{ headline, intro }` | Hero headline and subtext. |
| `sellingPoints` | `string[]` | “Why Room to Grow” cards (e.g. “Clear career pathways”). |
| `personas` | `{ id, label, description, panelFocusSelf, panelFocusLeader }[]` | Persona definitions; panel copy differs by self vs leader. |
| `personaQualifyingQuestions` | `{ id, question, options: { label, personaId }[] }[]` | Quiz to set persona without exposing internal labels. |
| `programmes` | Programme objects (id, title, whoItsFor, skillsDeveloped, whatToExpect, timeCommitment, nextStep) | All programmes; used in route steps and Programme Explorer. |
| `routes` | `{ id, fromRoleId, toRoleId, steps, estimatedSteps, timeStyle }[]` | Prebuilt routes; steps from `buildSteps()`. |
| `stories` | `{ id, name, pathDescription, shortStory }[]` | Success story pins. |
| `faqs` | `{ id, question, answer }[]` | FAQ accordion content. |

### 5.2 Route & Step Logic

- **Role order:** `frontline` → `supervisor` → `manager` → `senior_manager` → `general_manager`.  
- **`buildSteps(fromRoleId, toRoleId)`:** Returns alternating role and programme steps. Programme between roles is mapped (e.g. `frontline_supervisor` → `journey_supervisor`). Each step has `type: 'role' | 'programme'`, `id` (e.g. `role_frontline`, `programme_journey_supervisor`), `label`.  
- **`getRoute(fromRoleId, toRoleId)`:** Returns the matching route object from `routes` or `null`.

### 5.3 Helpers

- `getProgrammeById(id)`  
- `getStoryById(id)`  
- `getRoleLabel(roleId)`

All content is mock/campaign content; placeholder images use `placehold.co` (hero, selling points, programmes, stories).

---

## 6. Component Catalogue

### 6.1 Layout & Shell

- **Header** — Sticky top bar: “IHG University”, “Room to Grow”, “Help / FAQ”. No links or behaviour beyond layout.  
- **Container** — Wrapper for max-width content: `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`. Used for Intro and SellingPointsGrid.  
- **Footer** — Links to `#faq`, `#accessibility`, `#privacy`, `#legal`. No sections defined for the latter three.

### 6.2 Hero & Above-the-Fold

- **HeroVideoSection** — Full-viewport hero with placeholder image, strapline headline/intro, CTAs “Start Exploring” and “I’m developing my team”, and a play button (no video wired). Calls `onStartExploring()` and `onLeaderMode()`; parent scrolls to navigator.

### 6.3 Intro & Selling Points

- **IntroSection** — “Room to Grow” and “journey starts here” Three paragraphs from `introBlock`: internal comms line, IHG University explanation, journey CTA.
- **ManagerSupportSection** — "Supporting your team": manager guidance list (four items) and "4 steps you can take now"; two-column layout on desktop.
- **SellingPointsGrid** — “Why Room to Grow” section: horizontal carousel of cards from `sellingPoints`, with prev/next buttons (desktop). Uses `#selling-points-carousel`; scroll-snap on mobile. Below it, “Path Finder” heading and short explanatory copy.

### 6.4 Growth Navigator Section

Section has `id="growth-navigator"` and `ref={navigatorRef}`. Two layouts:

- **Desktop (md+):** Left sidebar (sticky) with NavigatorControls + RoutePanel; right: optional “Tailored for you” bar, RouteSummaryBar, MapCanvas.  
- **Mobile:** MapCanvas full width; “Search & filters” button opens MobileDrawer; drawer contains same NavigatorControls + RoutePanel.

**NavigatorControls** — From/To role dropdowns (from `roles`), “Find Route” button (calls `onFindRoute(fromRoleId, toRoleId)`), and time filter (10m, 30m, 1h, Longer) as radio buttons. Time filter is controlled (`timeFilter`, `onTimeFilterChange`); used in UI only (no filtering of programmes in the current implementation).

**RouteSummaryBar** — When `currentRoute` is set: shows “FromRole → ToRole”, optional “Persona: …”, step count, “Learning style: …”. Hidden when no route.

**PersonaQualifier** — Optional quiz: one question (“What do you want to get from IHG University?”) with options that map to `personaId`. On choice, calls `onSelectPersona(personaId)` and hides quiz; “Change” reopens it. Rendered inside MapCanvas when no route is selected and persona not set.

**MapCanvas** — Central navigator UI.  
- **No route:** Shows PersonaQualifier or message “Choose your current role and destination, then click Find Route”; below, Programme Explorer carousel (all programmes).  
- **With route:** Renders route as a horizontal chain of RouteNodes (role/programme steps) with connectors; below, “Success stories” row of StoryPins; then Programme Explorer carousel. Selecting a programme card scrolls carousel to it (when selection is from a route step). Programme cards and story pins call `onSelectProgramme`, `onSelectStory`, `openDrawer` as appropriate.

**RouteNode** — One step on the route: dot + label. States: `current` (first role, “You are here”), `selected`, `future`. `onClick(nodeId)`.

**StoryPin** — Card for a success story (image, name, path description). `onClick(storyId)`.

**RoutePanel** — Detail panel content:  
- **Story:** Image, name, path description, short story.  
- **Programme:** Image, title, who it’s for, skills, what to expect, time, next step; optional persona focus (self vs leader); “Explore programme” CTA.  
- **Role:** Image, role label, short blurb; optional persona focus.  
- **Empty:** “Select a node, story, or programme…”  
If `onClose` is passed (e.g. in drawer), shows Close button.

**MobileDrawer** — Fixed overlay (mobile only, `md:hidden`); bottom sheet with close overlay and Close button; renders `children` (NavigatorControls + RoutePanel). Shown when `open` is true; `hasContent` is passed but not used for behaviour (could drive “Search & filters” vs “Back” copy).

### 6.5 FAQ & Footer

- **FAQSection** — Accordion: one open FAQ at a time (`openId` state). Uses `faqs` from content model. Section `id="faq"` for anchor.  
- **Footer** — Already described above.

### 6.6 Unused / Alternative Components

- **NavigatorSearchBar** — Same role as the dropdowns in NavigatorControls (From/To + Find Route) but different layout; not imported in App.  
- **TimeFilter** — Standalone time filter UI; logic duplicated inside NavigatorControls.  
- **ProgrammeCards** — Standalone “Programme Explorer” section with Journey vs Diploma groups in a grid; not used in App (MapCanvas has its own Programme Explorer carousel).  
- **PersonaToggle** — Dropdown to pick persona by label; App uses PersonaQualifier (quiz) instead.

---

## 7. Styling & Theming

- **Tailwind:** Utility-only; `theme.extend` is empty. No design tokens or custom theme in config.  
- **Global (index.css):** `@tailwind base/components/utilities`; `html/body` and `#root` margin/overflow; scrollbar hidden for `#selling-points-carousel` and `.programme-explorer-carousel`.  
- **Palette:** Grays (50–800), blue for links (“Change”, “Explore programme”). No CSS variables; no dark mode.  
- **Responsive:** Breakpoints used for layout (e.g. `md:flex-row`, `md:sticky`, `md:hidden` for drawer), carousel behaviour (snap vs no snap), and typography (e.g. `md:text-4xl`).  
- **Accessibility:** Semantic HTML; `aria-label`, `aria-expanded`, `aria-pressed` where relevant; sr-only for radio inputs; no focus-ring customization documented.

---

## 8. Build, Scripts & Deployment

- **Scripts:** `npm run dev` (Vite dev server), `npm run build` (Vite build), `npm run lint` (ESLint), `npm run preview` (preview production build).  
- **Build output:** `dist/` with `index.html`, hashed JS/CSS assets, and copied `public/` assets.  
- **No env or feature flags** in the codebase; no server or API.  
- **Deployment:** Static hosting (e.g. Netlify, Vercel, S3+CloudFront) serving `dist/`; SPA so fallback to `index.html` for client-side routing if any routes are added later.

---

## 9. Functionality Summary

| Feature | Implementation |
|---------|----------------|
| Hero CTAs | Scroll to Growth Navigator; set leader mode. |
| Role-based route | From/To selects → Find Route → `getRoute()` → steps rendered as RouteNodes. |
| Time filter | UI state only; no filtering of programmes or steps. |
| Persona | Quiz (PersonaQualifier) sets `selectedPersonaId`; RoutePanel and “Tailored for you” bar use it for copy. |
| Leader mode | Toggle from hero; panel shows `panelFocusLeader` for relevant personas. |
| Route interaction | Click node → panel shows role or programme detail; first role can show “You are here”. |
| Success stories | StoryPin click → panel shows story. |
| Programme Explorer | Carousel of all programmes; click → panel shows programme; scroll-into-view when step is programme. |
| Mobile | Drawer for controls + panel; “Search & filters” opens it; same data and behaviour as desktop. |
| FAQ | Accordion; one open at a time. |
| Placeholder media | placehold.co for hero, selling points, programmes, stories. |
| Video | Play button present; no source or handler. |

---

## 10. Possible Extensions & Considerations

- **Routing:** Add URL state (e.g. `?from=frontline&to=manager`) for shareable links and back/forward.  
- **Time filter:** Filter programmes or suggest “fits in 30m” etc. using `timeCommitment` or tags.  
- **Real media:** Replace placehold.co with real images/video and consider lazy loading.  
- **Help / FAQ:** Wire Header “Help / FAQ” to `#faq` or a dedicated help view.  
- **Footer anchors:** Add `#accessibility`, `#privacy`, `#legal` sections or pages.  
- **Analytics:** Add events for Find Route, persona selection, programme/story clicks, leader mode.  
- **A11y:** Review focus order, keyboard navigation for carousels and drawer, and reduce motion if needed.  
- **Content:** Move content to CMS or config (e.g. JSON) and load at runtime if non-developers need to edit.  
- **Unused components:** Either remove NavigatorSearchBar, TimeFilter, ProgrammeCards, PersonaToggle or integrate them (e.g. alternate layouts or A/B tests).

---

## 11. File Reference (Quick Index)

| File | Role |
|------|------|
| `index.html` | Entry HTML, title, root div, script to main.jsx |
| `src/main.jsx` | React root, StrictMode, App, index.css |
| `src/App.jsx` | State, layout, all sections, event handlers |
| `src/data/contentModel.js` | All copy, roles, personas, programmes, routes, stories, FAQs, helpers |
| `src/index.css` | Tailwind + scrollbar hide |
| `tailwind.config.js` | Content paths, empty theme extend |
| `vite.config.js` | React plugin |
| `package.json` | name, scripts, dependencies (react, react-dom), devDependencies (vite, tailwind, eslint, etc.) |

This document is the single source of truth for the site’s technical and strategic design as of the current codebase.
