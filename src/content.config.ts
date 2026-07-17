import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One Markdown file per entry. Frontmatter is validated against these
// schemas at build time, so a typo'd field fails loudly instead of
// rendering a broken page.

const sessions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sessions' }),
  schema: z.object({
    title: z.string(),
    sessionNumber: z.number().int().nonnegative(),
    date: z.coerce.date(),
    // One-liner shown in the session list.
    summary: z.string().optional(),
    // Which players were at the table (handy with a 7-player roster).
    playersPresent: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const characters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/characters' }),
  schema: z.object({
    name: z.string(),
    player: z.string(),
    ancestry: z.string(), // race/species
    class: z.string(),
    level: z.number().int().positive().optional(),
    status: z.enum(['active', 'retired', 'dead', 'missing']).default('active'),
    // Path under /public, e.g. /images/characters/rook.jpg
    portrait: z.string().optional(),
    // One-line bio shown on the roster card ("Builds things that mostly work.")
    tagline: z.string().optional(),
    // Short descriptors rendered as pills ("Tinkerer", "Afraid of Dragons")
    traits: z.array(z.string()).default([]),
  }),
});

const npcs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/npcs' }),
  schema: z.object({
    name: z.string(),
    role: z.string().optional(), // e.g. "Innkeeper", "White Dragon"
    affiliation: z.string().optional(), // shown next to role: place, group, or faction name
    faction: z.string().optional(), // slug of a faction entry, for linking
    // Disposition toward the party (drives the status pill):
    // neutral renders as "At Large", unresolved as "Unresolved Thread".
    status: z.enum(['ally', 'hostile', 'unresolved', 'neutral']).default('neutral'),
    // Short directory blurb ("Means well. Is in over his head.")
    note: z.string().optional(),
    firstAppearance: z.number().int().optional(), // session number
    portrait: z.string().optional(),
  }),
});

const factions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/factions' }),
  schema: z.object({
    name: z.string(),
    type: z.string().optional(), // guild, cult, kingdom, ...
    status: z.enum(['active', 'destroyed', 'dormant', 'unknown']).default('active'),
    alignment: z.string().optional(), // friendly / hostile / complicated
    summary: z.string().optional(),
  }),
});

const locations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/locations' }),
  schema: z.object({
    name: z.string(),
    // Position on the map SVG, in viewBox units (0–1000 wide, 0–750 tall).
    x: z.number().min(0).max(1000),
    y: z.number().min(0).max(750),
    kind: z
      .enum(['town', 'settlement', 'landmark', 'dungeon', 'camp', 'lair'])
      .default('landmark'),
    // visited = the party has been there; known = seen/confirmed from afar;
    // rumored = only heard about. Drives the marker style.
    status: z.enum(['visited', 'known', 'rumored']).default('rumored'),
    // Renders the marker in ember (reserved for genuine danger).
    danger: z.boolean().default(false),
    firstVisited: z.number().int().optional(), // session number
    // One-liner for the marker tooltip and the top of the detail panel.
    summary: z.string().optional(),
    // Which side of the marker the map label sits on.
    labelPlacement: z.enum(['top', 'bottom', 'left', 'right']).default('bottom'),
    // Optional slugs of a lore entry / faction entry to link from the panel.
    lore: z.string().optional(),
    faction: z.string().optional(),
  }),
});

// One YAML file per session: where the party travelled (ordered location
// slugs — consecutive stops become route segments on the map) and what
// happened where (event pins).
const journey = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/journey' }),
  schema: z.object({
    session: z.number().int().nonnegative(),
    route: z.array(z.string()).default([]),
    events: z
      .array(
        z.object({
          title: z.string(),
          at: z.string(), // location slug
          note: z.string().optional(),
          // battle pins render in ember; everything else in gold.
          kind: z.enum(['battle', 'discovery', 'social', 'omen']).default('discovery'),
        })
      )
      .default([]),
  }),
});

const lore = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lore' }),
  schema: z.object({
    title: z.string(),
    category: z.string().default('general'), // places, history, items, ...
    summary: z.string().optional(),
  }),
});

export const collections = { sessions, characters, npcs, factions, lore, locations, journey };
