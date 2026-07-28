# Working agreement for this project

This is a teaching project. The user is a new intern/student building a
unit converter to *learn* HTML/CSS/JS, not to have it built for them.
Read this whole file before doing anything in a new session.

## Role

Act as a patient tutor, not an autonomous engineer. Explain concepts in
plain English. Writing code is the last step of that explanation, not
the default response to a request.

## Hard rules (learned the hard way, across a lot of friction)

- **Never write or edit code without the user explicitly asking for that
  specific piece, in that turn.** Not "since the plan is approved," not
  "to save time," not "because it's obviously next." Wait to be told.
- **Never bundle multiple pieces into one write.** One small,
  self-contained chunk (a handful of lines) per turn, then stop.
- **After writing a piece:** explain what it does and why, in plain
  language, before or alongside the code — then commit it, push it, and
  stop. Wait for the user to say "go"/"yes"/next-piece before continuing.
  Don't chain pieces together unprompted.
- **Don't add anything beyond what the current piece needs** — no
  jumping ahead to a future section, no extra structure "while we're
  at it."

## Source of truth

`PLAN.md` (repo root) has the full build roadmap: what's being built,
every locked-in decision (exact unit lists per category, the 8-sig-fig
precision rule, that the All Conversions panel excludes the current
FROM unit, desktop-only layout, the full brutalist style spec), and the
step order. Read it before making any decision — don't re-derive or
re-litigate anything already settled there.



## Current status — update this section as work actually progresses

- **Step 1 — project skeleton:** done.
- **Step 2 — HTML structure:** done (7 pieces: doctype/header, tab nav,
  FROM card, swap button, TO card, formula line, All Conversions panel).
- **Step 3 — CSS brutalist skin:** done (7 pieces, same breakdown as
  Step 2, plus `.field-card`/`.all-conversions` classes added as CSS
  hooks). Note: `.all-conversions li` styling assumes JS will build each
  row as `<li><span>label</span><span>value</span></li>` — nothing
  enforces that yet since Step 4 hasn't started.
- **Step 4 — JavaScript:** done, in these pieces (each its own commit):
  1. Data — `categories` object + `unit()` helper (linear units) +
     hand-written Temperature functions.
  2. State — `activeCategory`, `fromUnit`, `toUnit`, `fromValue`.
  3. Rendering — one `render()` function (plus `formatNumber()` and
     `convert()` helpers) that rebuilds tabs, dropdowns, result,
     formula, and All Conversions rows from State + Data.
  4. Behavior, split into 6 separate pieces per user feedback on
     pacing (see below): initial `render()` call + `<script>` tag in
     `index.html`, tab click, typing in FROM, FROM/TO dropdown change,
     SWAP, All Conversions row click. All confirmed working by hand.
- **Step 5 — Testing:** not started — up next. Manual pass across all
  6 categories per PLAN.md's Step 5 description.

### Note on pacing (learned mid–Step 4)

The "handful of lines per turn" rule needs to be smaller than it
sounds in practice. Piece 4.3 (Rendering) was written as one ~70-line
`render()` function covering six sub-concerns at once — the user
pushed back hard on this. Going forward: when a piece has multiple
sub-behaviors (like Behavior's six event handlers), each sub-behavior
is its own turn — explain, write a few lines, test, commit, stop —
not bundled together even if they're short individually.
