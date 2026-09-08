# lukhyatt.github.io

Single-page portfolio for Luke Hyatt. Plain HTML, CSS and vanilla JS — no framework,
no bundler, no build step. Published with GitHub Pages from `main` at the repo root.

```
index.html            the whole page
css/styles.css        design tokens + all styles
js/main.js            mobile nav, current-section marker, focus handling
assets/
  luke-hyatt-resume.pdf
  favicon.svg
  img/og.png          social preview card (1200x630)
  img/                project screenshots and clips go here
.nojekyll             tells Pages to serve the files as-is
```

## Preview locally

```bash
python3 -m http.server 8123
```

Then open <http://localhost:8123>. Opening `index.html` straight from Finder works too,
but the paths behave more like production over a server.

## Design system

The page is built like an instrument reading: one hairline axis runs the full height of
the content, section titles sit on it as filled ticks, and every entry hangs off it as a
hollow node. The axis appears at 760px and up; below that the rail collapses and section
titles keep a small inline tick.

Everything visual is a custom property at the top of `css/styles.css`:

| Token | Value | Role |
| --- | --- | --- |
| `--paper` | `#f3f4f1` | page ground |
| `--surface` | `#fbfbfa` | media frames, mobile nav panel |
| `--ink` | `#12161c` | headings, filled ticks |
| `--body` | `#3c4550` | body copy (8.8:1 on paper) |
| `--muted` | `#5c6673` | dates, labels, locations (5.3:1) |
| `--rule` | `#d5d9d2` | hairlines and the axis |
| `--node` | `#98a0a6` | hollow node outlines, bullet dashes |
| `--accent` | `#0057b8` | links and the current section only (6.2:1) |

Type is Archivo 600/700 for the name and section titles, IBM Plex Sans 400/500/600 for
everything else. Sizes are the `--step-*` scale; `--measure` and `--measure-narrow` cap
line length at roughly 78 characters, so widening the column will not create long lines.

Four rules worth keeping if you edit this: everything lands on the axis, no drop shadows
or rounded corners, the accent is for links and the current section and nothing else, and
motion stays out of it (there are no scroll animations, and `prefers-reduced-motion` is
honoured).

## Adding an experience entry

Copy any `<article class="entry">` inside `#experience` and edit the text. The order on
the page is the order in the file; newest first.

```html
<article class="entry">
  <div class="entry__head">
    <h3 class="entry__name">Role</h3>
    <p class="entry__dates">Mon 20XX – Mon 20XX</p>
  </div>
  <p class="entry__meta">
    <span class="entry__org">Organization</span>
    <span class="entry__loc">City, ST</span>
  </p>
  <ul class="entry__bullets">
    <li>What you did and what came of it.</li>
  </ul>
</article>
```

Optional pieces, both already used in the file:

- `<p class="entry__handoff"><a href="#project-id">Full write-up under Projects</a></p>`
  for a role whose detail lives in a project card. Don't repeat the same bullets in both
  places — a reader scrolling past the same sentence twice reads it as padding.
- `<p class="entry__pub">` for a publication, with `entry__pub-label`, a `<cite>` title
  and `entry__pub-venue`. It renders set apart from the bullets rather than lost in them.

## Adding a project card

Copy any `<article class="entry entry--project">` inside `#projects`. Give it an `id`
(`project-something`) so experience entries can link to it. Cards are ordered strongest
first; `entry--lead` gives the first card a slightly larger media slot.

The affiliation line under the name is the same `entry__meta` — use the lab name for
research work and `Personal project` for independent work.

Tech tags:

```html
<ul class="tags"><li>Python</li><li>PyTorch</li></ul>
```

### Images and video

Every card has a commented-out media slot. Uncomment it and drop the file in
`assets/img/`. An empty slot renders nothing at all, so a card without media is not a
gap or a broken image.

```html
<figure class="entry__media">
  <img src="assets/img/name.png" alt="What the image shows." width="1200" height="750">
  <figcaption>Optional one-line caption.</figcaption>
</figure>
```

For two figures side by side, wrap them in `<div class="media-pair">` — the benchmarking
card does this. The pair sits two-up above 560px and stacks below it.

A video or GIF works in the same slot — swap `<img>` for
`<video src="…" poster="…" controls muted loop playsinline>`. Always set `width` and
`height` so the page doesn't jump while the file loads, and write real `alt` text
(`alt=""` only for images that add nothing a caption doesn't already say). Keep files
small; the whole page should stay well under 500KB.

### Repo links

Each card has a commented-out `entry__repo` link. Uncomment it only once you have
confirmed the repo is public — a recruiter hitting a 404 is worse than no link.

## Before publishing lab work

Two of the project cards describe work that isn't solely yours, and one describes a paper
still under review. Confirm before adding anything beyond the current text:

- **The ICRA submission is under review.** The resume-level description here (benchmarking
  pipeline, simulation scenarios, comparison against prior work) matches what is already on
  a circulated resume. The two figures on that card are training-run visualisations of the
  2D and 3D benchmark scenarios, published deliberately — if the PI or T. Qin would rather
  nothing from the submission were public before review closes, delete the `media-pair`
  block from `#project-benchmarking` and the two files in `assets/img/`. Method details and
  result figures from the paper itself are a separate question and still need clearing.
- **The Spot project** may be subject to lab policy on photos and video of the hardware,
  especially given the accessibility application. Ask before posting footage.
- **Repos.** Confirm whether the lab repos can be linked publicly at all.

Until someone says otherwise: describe the contribution and the engineering, don't publish
figures, footage or code.

## Deploy

Pushing to `main` is the deploy. First time only:

1. Repo → Settings → Pages → Source: **Deploy from a branch** → `main` / `/ (root)`.
2. Wait a couple of minutes, then check <https://lukhyatt.github.io>.
3. Open it on an actual phone before sending the link anywhere.

If a change doesn't show up, it is almost always browser cache — hard reload first.
