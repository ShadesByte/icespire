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
    tagline: z.string().optional(),
  }),
});

const npcs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/npcs' }),
  schema: z.object({
    name: z.string(),
    role: z.string().optional(), // e.g. "Blacksmith of Phandalin"
    location: z.string().optional(),
    faction: z.string().optional(), // slug of a faction entry, if any
    status: z.enum(['alive', 'dead', 'unknown']).default('alive'),
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

const lore = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lore' }),
  schema: z.object({
    title: z.string(),
    category: z.string().default('general'), // places, history, items, ...
    summary: z.string().optional(),
  }),
});

export const collections = { sessions, characters, npcs, factions, lore };
