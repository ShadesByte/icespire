# Icespire Campaign Website

The chronicle of our D&D campaign: session recaps, a running campaign summary,
character profiles, an NPC directory, and faction & lore pages.

Built with [Astro](https://astro.build) and deployed to GitHub Pages at
**https://shadesbyte.github.io/icespire/** (deploys automatically on every push
to `main`).

## Adding content

All content lives as Markdown files — one file per entry. To add something,
copy an existing file in the right folder, rename it, and edit:

| What | Where | Notes |
| --- | --- | --- |
| Session recap | `src/content/sessions/` | Name files `session-02.md`, `session-03.md`, … Set `draft: true` to hide one. |
| Character profile | `src/content/characters/` | One per PC. Filename becomes the URL slug. |
| NPC | `src/content/npcs/` | `faction:` can reference a faction's filename (without `.md`) to link them. |
| Faction | `src/content/factions/` | |
| Lore page | `src/content/lore/` | Grouped by `category:` on the lore index. |
| Campaign summary | `src/pages/campaign.md` | A single running page — edit it in place after sessions. |

Frontmatter (the `---` block at the top of each file) is validated at build
time — the schemas live in `src/content.config.ts`. If a build fails after
adding content, the error message will point at the field that's wrong.

Images (character portraits etc.) go in `public/images/` and are referenced
from frontmatter like `portrait: /images/characters/rook.jpg`.

## Development

```sh
npm install
npm run dev      # local dev server at localhost:4321
npm run build    # production build (also validates all content)
```

## One-time GitHub setup

For deploys to work, enable Pages in the repo settings:
**Settings → Pages → Source: "GitHub Actions"**.

## Design

Current styles in `src/styles/global.css` are placeholders — the real design
system will replace them.
