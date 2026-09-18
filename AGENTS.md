# Ristretto: agent playbook

A static, design-first coffee shop site. One page, no backend, no build
step. Everything an owner asks for is an edit to `public/index.html`
followed by a deploy.

## Files

- `public/index.html`: the whole site (nav → hero → ticker → the board
  and this month's single origin → the roastery, retail bags and the
  grind-for-your-brewer line → the room and the laptop policy →
  wholesale and cupping cards → the founders → hours, find us, order
  ahead → footer).

## Theme

All colors live in the `:root` token block at the top of `<style>`.
`--ground` is the warm paper, `--ink` is the espresso text and also the
ground of the flipped roastery section, `--accent` is the single
crema-orange accent. `--crema` is a pale tint of the accent used only
on the single-origin card; retune it whenever the accent changes.
`--ground-2` is the lifted paper band behind the wholesale and cupping
cards. `--hairline` rules the paper sections, `--hairline-dark` rules
the roastery.

Fonts are Bodoni Moda (display, high-contrast) + Inter (text) via one
Google Fonts `<link>`. Swap the `<link>` and the `--serif`/`--sans`
tokens together. Bodoni is also used for every price figure.

## Images

Six slots, all absolute URLs. Search "storage/sites/ristretto" to find
every one.

- `bar.jpg` (16:9): the hero, `.hero-media img`, not lazy. Also the OG image.
- `roaster.jpg` (4:3): `.roast-photo` in the roastery.
- `bags.jpg` (1:1): `.bags-photo` beside the retail list.
- `room.jpg` (4:3): `.room-pic-a`, the larger half of the pair.
- `latte.jpg` (1:1): `.room-pic-b`, the smaller, lifted half of the pair.
- `founders.jpg` (4:3): `.founders-photo`.

Every slot has a solid fallback color on its container, so a missing
image never breaks the composition. Replace by uploading the owner's
photos (or any URL) and swapping the `src`; keep the slot's aspect ratio.

## Common asks

- **This month's single origin**: the `#origin` card. Month in
  `.origin-month`, name in its `h3`, the `<dl>` for producer, varietal,
  process and roast, then `.origin-notes`, `.origin-price` and
  `.origin-next`. The same origin is named in THREE other places: the
  ticker (both `.ticker-group` copies), the "Single Origin" row in
  `.bags`, and the cupping card copy. Update all of them.
- **Menu prices**: each drink is one `<li>` in a `.rows` list inside a
  `.board` (`.i-name`, `.i-note`, `.i-price`). Add a drink by copying a
  row. Footnotes are `.board-foot`. Retail bags use the same `.rows`
  markup inside `.bags`.
- **Hours**: appear in THREE places (the `.nav-hours` pill, the
  `.hours` list in `#visit`, the footer line). The roast-day mention
  also lives in the `#visit` note and in the roastery copy.
- **Phone**: the order-ahead number is in the nav CTA, the cupping
  card button, the `#visit` order-ahead column and the footer. Emails:
  `hello@` in visit and footer, `wholesale@` on the wholesale card.
- **Cupping date**: the last `.card-meta` item on `#cupping`.
- **Laptop policy**: the `.policy` list in `#room`, three items.
- **Rename the shop**: wordmark in nav + footer, `<title>` and OG
  tags, the favicon SVG letter, and the pull quote in `#founders`,
  which explains the name.
- **New section**: copy an existing `<section>` shell and its
  `.reveal` class so the scroll animation applies. Stagger siblings
  with `style="transition-delay:.08s"`.

## Constraints

- Keep it static. No frameworks, no ordering widgets; order-ahead is a
  text message by design, and contact is `mailto:` / `tel:`.
- Don't inline new web-font `@import`s inside `<style>`; use `<link>`
  tags in `<head>`.
- Preserve `prefers-reduced-motion` handling if you touch animations
  (the ticker stops and the reveals become instant).
- No emoji; icons are inline SVG.
- Keep the `navigator.webdriver` block in the script; the screenshot
  farm and crawlers depend on it.
