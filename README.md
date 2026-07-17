# Dragon of Icespire Peak — Campaign Website

The chronicle of our D&D campaign: session recaps, a running campaign summary,
the party roster, an NPC directory, and a faction & lore codex.

Built with [Astro](https://astro.build) and deployed to GitHub Pages at
**https://shadesbyte.github.io/icespire/** (deploys automatically on every push
to `main`).

## Site structure

| Nav item | Route | Source |
| --- | --- | --- |
| Recaps | `/sessions/` | `src/content/sessions/` |
| Campaign | `/campaign/` | `src/pages/campaign.md` (single running page, edit in place) |
| Map | `/map/` | `src/content/locations/` + `src/content/journey/` |
| Roster | `/characters/` | `src/content/characters/` |
| NPCs | `/npcs/` | `src/content/npcs/` |
| Codex | `/codex/` | factions (`src/content/factions/`) + lore (`src/content/lore/`) |

## Adding content

All content lives as Markdown files — one file per entry. Copy an existing file,
rename it, and edit. The current content is **sample data from the design system**;
replace it with the real campaign as you go.

- **Sessions**: `session-15.md` etc. Frontmatter: `title`, `sessionNumber`, `date`,
  `summary` (the card excerpt), `playersPresent`, optional `draft: true` to hide.
- **Characters**: `name`, `player`, `ancestry`, `class`, optional `level`,
  `status` (active/retired/dead/missing), `tagline` (one-line bio on the card),
  `traits` (short pill labels), optional `portrait`.
- **NPCs**: `name`, `role`, `affiliation` (shown as "Role · Affiliation"),
  `status` — one of `ally`, `hostile`, `unresolved` ("Unresolved Thread"), or
  `neutral` ("At Large") — plus `note` (directory blurb), optional `faction`
  (a faction file's name, for linking) and `firstAppearance`.
- **Factions**: `name`, `type`, `status`, `alignment`, `summary` (codex panel text).
- **Lore**: `title`, `category` (places/history/items/…), `summary`.
- **Locations** (`src/content/locations/`): places on the campaign map. `name`,
  `x`/`y` (map coordinates in the SVG's 1000×750 space), `kind`
  (town/settlement/landmark/dungeon/camp/lair), `status`
  (`visited`/`known`/`rumored` — drives the marker style), optional `danger`
  (ember marker, reserved for real threats), `firstVisited` (session number),
  `summary` (tooltip/panel one-liner), `labelPlacement` (top/bottom/left/right),
  and optional `lore`/`faction` slugs to link from the detail panel. The body
  is the panel write-up.
- **Journey** (`src/content/journey/session-N.yaml`): one YAML file per
  session. `route` is the ordered list of location slugs the party travelled
  through (consecutive stops become route segments on the map — include
  intermediate stops on return trips so the trail overlaps instead of cutting
  a new line). `events` pins notable moments to a location: `title`, `at`
  (location slug), optional `note`, and `kind`
  (`battle`/`discovery`/`social`/`omen` — battles pin in ember). Unknown slugs
  fail the build.

### The map

`/map/` renders a custom SVG of the Phandalin region
(`src/components/map/MapTerrain.astro` — terrain only; markers, route, and
event pins are generated from the content collections by
`src/pages/map/index.astro`). The map pans and zooms (drag/scroll/pinch),
markers open a detail panel with links to recaps and codex entries, and
`/map/#location-slug` deep-links to a location. Terrain colors live in the
Campaign Map section of `src/styles/global.css` and follow both themes.

Frontmatter is validated at build time (`src/content.config.ts`); a bad field
fails the build with a pointed error.

### Design elements inside recaps

Markdown blockquotes render as gold-bordered pull quotes automatically. Add an
attribution with a `<footer>` line inside the quote:

```markdown
> I said the sled was fine. I did not say it would stay fine.
>
> <footer>— Brindle Cogsworth (played by Alex)</footer>
```

Callout boxes (game mechanics stay out of narrative prose per the design system):

```html
<div class="callout loot">           <!-- or magic-item / house-rule -->
  <div class="callout-label">Loot</div>
  <div class="callout-title">The Necklace, Found Again</div>
  <div class="callout-body">Recovered from the temple vault.</div>
</div>
```

Character portraits go in `public/images/characters/` and are referenced as
`portrait: /images/characters/brindle.jpg`.

## Design system

The design is implemented from the **Icespire Peak Campaign Design System**
(Claude Design). Key rules, so edits stay on-system:

- Dark theme ("Night in the Wilds") is default; the nav button toggles the light
  "Snowfield" theme via `data-theme="light"`.
- Cold slate neutrals everywhere; **gold is the only "pay attention" color**;
  **ember red is reserved for danger/hostility only**.
- Cinzel for display/headings only, Crimson Pro for body, JetBrains Mono for
  stat blocks/dice notation. No emoji, no parchment textures.
- Tokens live in `src/styles/tokens/` (verbatim from the design project);
  component classes in `src/styles/global.css`; Astro components in
  `src/components/`.
- Fonts load from Google Fonts (the design system's documented substitution —
  swap `src/styles/tokens/fonts.css` if self-hosting later).

## Development

```sh
npm install
npm run dev      # local dev server at localhost:4321
npm run build    # production build (also validates all content)
```

## One-time GitHub setup

For deploys to work, enable Pages in the repo settings:
**Settings → Pages → Source: "GitHub Actions"**.
