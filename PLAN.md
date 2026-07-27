# PLAN — Brutalist Unit Converter

This document is the roadmap for building the app. No code lives here —
just what we're building, in what order, and why. Each step below gets
its own conversation before anything is typed into a file.

## What we're building

A single-page unit converter with 6 categories (Length, Weight,
Temperature, Volume, Speed, Area). Each category has a FROM field+unit,
a TO field+unit, a SWAP button, a formula readout, and an "All
Conversions" panel that lists every other unit in that category and lets
you click one to make it the new TO target.

## Process for every step below

**Plan → Design → Code → Test**, applied at the level of each individual
step, not just once for the whole project:
1. *Plan* — what is this step responsible for, in plain English.
2. *Design* — what decisions does it require (layout, naming, behavior).
3. *Code* — written only when explicitly asked for, one step at a time.
4. *Test* — checked by hand before moving to the next step.

## Decisions already locked in

- **Categories & units** (confirmed against the Figma screenshots):
  - Length: Meter, Kilometer, Centimeter, Millimeter, Mile, Yard, Foot, Inch
  - Weight: Kilogram, Gram, Milligram, Tonne, Pound, Ounce, Stone
  - Temperature: Celsius, Fahrenheit, Kelvin
  - Volume: Liter, Milliliter, Cubic Meter, Gallon (US), Quart (US), Pint (US), Cup (US), Fl. Oz (US)
  - Speed: m/s, km/h, mph, Knot, ft/s
  - Area: Sq. Meter, Sq. Kilometer, Sq. Centimeter, Hectare, Acre, Sq. Mile, Sq. Foot
- **Precision**: 8 significant digits, trailing zeros trimmed.
- **All Conversions panel**: lists every unit in the category *except*
  the current FROM unit.
- **Layout target**: desktop-width only, matching the Figma frames —
  no mobile breakpoints for now.
- **Visual style**: brutalist monospace — JetBrains Mono throughout,
  2px solid black borders, no rounded corners anywhere, cream
  (`#f5f4f0`) background, electric yellow (`#ffe600`) as the only
  accent color, used on the active tab, the active target row in the
  All Conversions panel, and hover states.

## Build steps

**Step 1 — Project skeleton**
Three empty files exist already: `index.html`, `style.css`, `script.js`.
Nothing built yet.

**Step 2 — HTML structure**
Lay out the page regions with no styling and no behavior: header bar,
tab row (empty, to be filled by JS later), the FROM/SWAP/TO block, the
formula line, and the All Conversions panel container. Just the
skeleton of tags — an explanation of what element goes where and why,
before any markup is written.

**Step 3 — CSS (the brutalist skin)**
Style the skeleton from Step 2: colors, borders, font, spacing, and the
hover/active states for tabs and panel rows. No new structure gets
added here — CSS only changes how Step 2's elements look.

**Step 4 — JavaScript, in four sections**
1. *Data* — the category/unit list and each unit's conversion rule
   (already discussed conceptually: convert into a shared base unit,
   then out to the target unit).
2. *State* — the four values that describe what's currently selected
   (active category, FROM unit, TO unit, typed-in number).
3. *Rendering* — turning the State into what's actually shown on
   screen: the tabs, the two dropdowns, the result number, the formula
   sentence, and the All Conversions rows.
4. *Behavior* — what happens on a click or a keystroke: switching tabs,
   typing a number, changing a dropdown, hitting swap, clicking a row.
   This section only ever updates State and asks Rendering to redraw —
   it never touches the screen directly.

**Step 5 — Manual test pass**
Walk through every category by hand: type a known value, confirm the
math against a calculator, confirm swap and row-click behave correctly,
confirm the active tab/row highlighting matches. Nothing is marked done
until this step passes for all 6 categories.

## Ground rule for how we work

Nothing gets written into `index.html`, `style.css`, or `script.js`
until you explicitly say you're ready for that step. Until then, each
step is a conversation — concepts and reasoning only.
