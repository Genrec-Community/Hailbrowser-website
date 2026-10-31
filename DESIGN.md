# HailBrowser site — design notes

## Concept card

```
Idea:        HailBrowser is the browser you already trust, with hands. The site shows
             itself the way the agent sees a page: an indexed snapshot.
Metaphor:    A page snapshot. Sections are indexed elements; the left rail is the live
             read_page output for whatever page you are on.
Signature:   The hero demo. An agent cursor runs one decision at a time on a diagram
             of a search page (TYPE_TEXT -> CLICK [3] -> DONE) while the snapshot rail
             below the fold reports the same page you are reading, entry by entry.
Emotion:     Calm proof. Nothing is hyped, everything is numbered and it all works.
Motion verb: scan and settle. Hairlines draw, index labels slide 1px into place,
             controls answer with a small settle, the cursor travels in straight lines.
Screenshot:  the hero: "Real / Browser / Agent" with the ghosted middle line, the lime
             cursor ripple, and the mono snapshot card overlapping the type.
```

## Assumptions (replace before launch)

- Domain `https://hailbrowser.genrecai.com` is the production origin for `site` in `astro.config.mjs`,
  the canonical tags, sitemap, `robots.txt` and `llms.txt`.
- Version `0.1.0`, MIT licence, repo `Shyamnath-Sankar/project-hailbrowser`: taken from
  the repository at build time.
- Screenshots in `public/shots/` are the real ones in `docs/` (400x720 side panel,
  900x560 overlay). No invented product imagery anywhere.
- npm publishing (`npx hailbrowser-mcp`) is described as "after publishing", matching
  `docs/connect.md`; the site never claims the package is on npm today.

## Palette (from the supplied reference)

| Role | Hex | Use |
|---|---|---|
| ground | `#F2EFE8` | bone page |
| ground-2 | `#E8E4DA` | recessed bands, hover fills |
| ink | `#14130F` | text, dark band ground |
| muted | `#6B675F` | secondary text (AA on bone) |
| line | `#D8D3C7` | hairlines, borders |
| accent | `#C8F751` | lime: primary actions, cursor, live state |
| blush | `#F2C6BC` | small tags only, never text backgrounds with light text |
| dark | `#131210` | one full-bleed band |

Dark band inverts through `--ink` / `--ground` swaps on the section, so text colour
follows one variable.

## Type

- **Switzer** (Fontshare, self-hosted 400/500/600/700/800) for everything, display at
  700/800 with -0.04em tracking, body 400 at 17px/1.55.
- **JetBrains Mono** (Google, 400/500) for refs, tool names, code, meta labels,
  uppercase at 0.08em when used as a label.
- Display sizes are fluid; the hero is `clamp(3.4rem, 11.4vw, 10.2rem)` at line-height
  .86 so the three lines lock into a block like the reference.

## Grid and rhythm

- Frame: max 1480px, padding `clamp(20px, 4vw, 56px)`.
- Home and docs use a rail grid: `148px minmax(0,1fr)` at >=1180px, single column below.
- 12 columns inside the content column, 24px gutters. Sections separated by hairlines,
  and each section uses a different layout family: stacked display, split editorial,
  full-bleed dark, numbered list, three-step build, filterable table, tabbed snippets.
- Vertical rhythm: 80px to 128px between sections, tighter inside cards.

## Shape and motion

- One radius rule: 20px for surfaces, 28px for the big screenshot frame, 999px for
  pills. Nothing else is rounded.
- Easing: `cubic-bezier(.2,.7,.2,1)` for settles, 160ms for controls, 420ms for
  reveals, 700ms for the hero cursor path. Nothing bounces.
- One clock: Lenis + GSAP ticker + ScrollTrigger only. Everything registered on
  `astro:page-load` and reverted on `astro:before-swap`.
- Reduced motion: no Lenis, no scrub, no cursor loop; the diagram renders its end
  state and every section is fully visible.

## Genericness test (what was changed)

A generic model lands on: dark navy page, purple gradient, three feature cards,
"supercharge your workflow", a centred hero, and a fake dashboard. This site has none
of them: bone ground with lime, an editorial index rail that reports the real page,
one dark band, a demo that is a diagram of the actual decision loop, and copy taken
from the repository (tool names, ports, limits) instead of adjectives.

