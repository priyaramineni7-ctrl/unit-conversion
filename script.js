/* =========================================================================
   1. DATA
   -------------------------------------------------------------------------
   Every category picks one "base" unit as a neutral middle ground.
   For Length that's the meter. Every unit in the list knows two things:
     toBase(value)   -> convert FROM this unit INTO the base unit
     fromBase(value) -> convert FROM the base unit INTO this unit

   Converting between ANY two units, even weird ones like temperature
   (which isn't just multiplication), becomes a two-step trip:
     base   = fromUnit.toBase(inputValue)
     result = toUnit.fromBase(base)
   ========================================================================= */

const categories = [
  {
    id: 'length',
    label: 'Length',
    defaultFrom: 'meter',
    defaultTo: 'foot',
    units: [
      { id: 'meter',      label: 'Meter',      toBase: v => v,               fromBase: v => v },
      { id: 'kilometer',  label: 'Kilometer',  toBase: v => v * 1000,        fromBase: v => v / 1000 },
      { id: 'centimeter', label: 'Centimeter', toBase: v => v * 0.01,        fromBase: v => v / 0.01 },
      { id: 'millimeter', label: 'Millimeter', toBase: v => v * 0.001,       fromBase: v => v / 0.001 },
      { id: 'mile',       label: 'Mile',       toBase: v => v * 1609.344,    fromBase: v => v / 1609.344 },
      { id: 'yard',       label: 'Yard',       toBase: v => v * 0.9144,      fromBase: v => v / 0.9144 },
      { id: 'foot',       label: 'Foot',       toBase: v => v * 0.3048,      fromBase: v => v / 0.3048 },
      { id: 'inch',       label: 'Inch',       toBase: v => v * 0.0254,      fromBase: v => v / 0.0254 },
    ],
  },
  {
    id: 'weight',
    label: 'Weight',
    defaultFrom: 'kilogram',
    defaultTo: 'pound',
    units: [
      { id: 'kilogram',  label: 'Kilogram',   toBase: v => v * 1000,      fromBase: v => v / 1000 },
      { id: 'gram',      label: 'Gram',       toBase: v => v,             fromBase: v => v },
      { id: 'milligram', label: 'Milligram',  toBase: v => v * 0.001,     fromBase: v => v / 0.001 },
      { id: 'tonne',     label: 'Metric Ton', toBase: v => v * 1000000,   fromBase: v => v / 1000000 },
      { id: 'pound',     label: 'Pound',      toBase: v => v * 453.592,   fromBase: v => v / 453.592 },
      { id: 'ounce',     label: 'Ounce',      toBase: v => v * 28.3495,  fromBase: v => v / 28.3495 },
    ],
  },
  {
    id: 'temperature',
    label: 'Temperature',
    defaultFrom: 'celsius',
    defaultTo: 'fahrenheit',
    units: [
      { id: 'celsius',    label: 'Celsius',    toBase: v => v,                    fromBase: v => v },
      { id: 'fahrenheit', label: 'Fahrenheit', toBase: v => (v - 32) * 5 / 9,     fromBase: v => v * 9 / 5 + 32 },
      { id: 'kelvin',     label: 'Kelvin',     toBase: v => v - 273.15,           fromBase: v => v + 273.15 },
    ],
  },
  {
    id: 'volume',
    label: 'Volume',
    defaultFrom: 'liter',
    defaultTo: 'gallon',
    units: [
      { id: 'liter',      label: 'Liter',        toBase: v => v,             fromBase: v => v },
      { id: 'milliliter', label: 'Milliliter',   toBase: v => v * 0.001,     fromBase: v => v / 0.001 },
      { id: 'cubicMeter', label: 'Cubic Meter',  toBase: v => v * 1000,      fromBase: v => v / 1000 },
      { id: 'gallon',     label: 'Gallon (US)',  toBase: v => v * 3.78541,   fromBase: v => v / 3.78541 },
      { id: 'quart',      label: 'Quart (US)',   toBase: v => v * 0.946353,  fromBase: v => v / 0.946353 },
      { id: 'pint',       label: 'Pint (US)',    toBase: v => v * 0.473176,  fromBase: v => v / 0.473176 },
      { id: 'cup',        label: 'Cup (US)',     toBase: v => v * 0.24,      fromBase: v => v / 0.24 },
      { id: 'fluidOunce', label: 'Fluid Ounce',  toBase: v => v * 0.0295735, fromBase: v => v / 0.0295735 },
    ],
  },
  {
    id: 'speed',
    label: 'Speed',
    defaultFrom: 'meterPerSecond',
    defaultTo: 'milePerHour',
    units: [
      { id: 'meterPerSecond',     label: 'Meter/Second', toBase: v => v,             fromBase: v => v },
      { id: 'kilometerPerHour',   label: 'Kilometer/Hour', toBase: v => v * 0.277778, fromBase: v => v / 0.277778 },
      { id: 'milePerHour',        label: 'Mile/Hour',   toBase: v => v * 0.44704,   fromBase: v => v / 0.44704 },
      { id: 'knot',               label: 'Knot',        toBase: v => v * 0.514444,  fromBase: v => v / 0.514444 },
      { id: 'footPerSecond',      label: 'Foot/Second', toBase: v => v * 0.3048,    fromBase: v => v / 0.3048 },
    ],
  },
  {
    id: 'area',
    label: 'Area',
    defaultFrom: 'squareMeter',
    defaultTo: 'squareFoot',
    units: [
      { id: 'squareMeter',     label: 'Square Meter',     toBase: v => v,               fromBase: v => v },
      { id: 'squareKilometer', label: 'Square Kilometer', toBase: v => v * 1000000,     fromBase: v => v / 1000000 },
      { id: 'squareFoot',      label: 'Square Foot',      toBase: v => v * 0.092903,    fromBase: v => v / 0.092903 },
      { id: 'squareMile',      label: 'Square Mile',      toBase: v => v * 2589988.11,  fromBase: v => v / 2589988.11 },
      { id: 'acre',            label: 'Acre',             toBase: v => v * 4046.86,     fromBase: v => v / 4046.86 },
      { id: 'hectare',         label: 'Hectare',          toBase: v => v * 10000,       fromBase: v => v / 10000 },
      { id: 'squareYard',      label: 'Square Yard',      toBase: v => v * 0.836127,    fromBase: v => v / 0.836127 },
    ],
  },
];

/* =========================================================================
   2. STATE
   -------------------------------------------------------------------------
   "State" just means: the handful of values that describe what's on screen
   right now. Everything the app displays gets recomputed from this object,
   so it's the single source of truth.
   ========================================================================= */

const state = {
  categoryId: categories[0].id,
  fromUnitId: categories[0].defaultFrom,
  toUnitId: categories[0].defaultTo,
  value: 1,
};

/* =========================================================================
   3. DOM REFERENCES
   -------------------------------------------------------------------------
   Grab every element we'll need to touch, once, up front.
   ========================================================================= */

const el = {
  tabs: document.getElementById('tabs'),
  fromValue: document.getElementById('fromValue'),
  fromUnit: document.getElementById('fromUnit'),
  toValue: document.getElementById('toValue'),
  toUnit: document.getElementById('toUnit'),
  swapBtn: document.getElementById('swapBtn'),
  formula: document.getElementById('formula'),
  allHeaderValue: document.getElementById('allHeaderValue'),
  allList: document.getElementById('allList'),
};

/* =========================================================================
   4. HELPERS
   ========================================================================= */

function getCategory() {
  return categories.find(c => c.id === state.categoryId);
}

function getUnit(category, unitId) {
  return category.units.find(u => u.id === unitId);
}

// Converts a number from one unit to another inside the same category,
// by routing through the category's base unit (see the big comment above).
function convert(value, fromUnit, toUnit) {
  const baseValue = fromUnit.toBase(value);
  return toUnit.fromBase(baseValue);
}

// Numbers coming out of division/multiplication can look like
// 3.2808398950131235. Round to 6 significant digits and drop trailing zeros
// so the display stays clean, e.g. "3.28084".
function formatNumber(num) {
  if (!isFinite(num)) return '—';
  if (num === 0) return '0';
  return parseFloat(num.toPrecision(6)).toString();
}

/* =========================================================================
   5. RENDER FUNCTIONS
   -------------------------------------------------------------------------
   Each function's job is to look at `state` and update one piece of the
   page. None of them decide *when* to run — that's the event listeners'
   job, down in section 6.
   ========================================================================= */

function renderTabs() {
  el.tabs.innerHTML = '';
  categories.forEach(category => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tab' + (category.id === state.categoryId ? ' active' : '');
    btn.textContent = category.label.toUpperCase();
    btn.addEventListener('click', () => selectCategory(category.id));
    el.tabs.appendChild(btn);
  });
}

function renderUnitOptions() {
  const category = getCategory();

  function fillSelect(selectEl, selectedId) {
    selectEl.innerHTML = '';
    category.units.forEach(unit => {
      const option = document.createElement('option');
      option.value = unit.id;
      option.textContent = unit.label;
      selectEl.appendChild(option);
    });
    selectEl.value = selectedId;
  }

  fillSelect(el.fromUnit, state.fromUnitId);
  fillSelect(el.toUnit, state.toUnitId);
}

function renderConversion() {
  const category = getCategory();
  const fromUnit = getUnit(category, state.fromUnitId);
  const toUnit = getUnit(category, state.toUnitId);

  const result = convert(state.value, fromUnit, toUnit);
  el.toValue.textContent = formatNumber(result);

  el.formula.textContent =
    `${formatNumber(state.value)} ${fromUnit.label} = ${formatNumber(result)} ${toUnit.label}`;
}

function renderAllConversions() {
  const category = getCategory();
  const fromUnit = getUnit(category, state.fromUnitId);

  el.allHeaderValue.textContent = `${formatNumber(state.value)} ${fromUnit.label}`;
  el.allList.innerHTML = '';

  category.units.forEach(unit => {
    const row = document.createElement('div');
    row.className = 'all-row' + (unit.id === state.toUnitId ? ' active' : '');

    const label = document.createElement('span');
    label.className = 'all-row-label';
    label.textContent = unit.label;

    const value = document.createElement('span');
    value.className = 'all-row-value';
    value.textContent = formatNumber(convert(state.value, fromUnit, unit));

    row.appendChild(label);
    row.appendChild(value);

    // Clicking any row makes that unit the new "TO" target.
    row.addEventListener('click', () => {
      state.toUnitId = unit.id;
      el.toUnit.value = unit.id;
      renderConversion();
      renderAllConversions();
    });

    el.allList.appendChild(row);
  });
}

// Runs every render function. Called whenever something big changes,
// like switching categories.
function renderAll() {
  renderTabs();
  renderUnitOptions();
  renderConversion();
  renderAllConversions();
}

/* =========================================================================
   6. EVENT HANDLERS
   ========================================================================= */

function selectCategory(categoryId) {
  const category = categories.find(c => c.id === categoryId);
  state.categoryId = categoryId;
  state.fromUnitId = category.defaultFrom;
  state.toUnitId = category.defaultTo;
  state.value = 1;
  el.fromValue.value = 1;
  renderAll();
}

el.fromValue.addEventListener('input', () => {
  state.value = parseFloat(el.fromValue.value) || 0;
  renderConversion();
  renderAllConversions();
});

el.fromUnit.addEventListener('change', () => {
  state.fromUnitId = el.fromUnit.value;
  renderConversion();
  renderAllConversions();
});

el.toUnit.addEventListener('change', () => {
  state.toUnitId = el.toUnit.value;
  renderConversion();
  renderAllConversions();
});

el.swapBtn.addEventListener('click', () => {
  const category = getCategory();
  const fromUnit = getUnit(category, state.fromUnitId);
  const toUnit = getUnit(category, state.toUnitId);

  // The current result becomes the new starting value, and the two
  // units trade places — that's what makes a "swap" feel natural.
  const newValue = convert(state.value, fromUnit, toUnit);

  state.value = newValue;
  [state.fromUnitId, state.toUnitId] = [state.toUnitId, state.fromUnitId];

  el.fromValue.value = formatNumber(newValue);
  el.fromUnit.value = state.fromUnitId;
  el.toUnit.value = state.toUnitId;

  renderConversion();
  renderAllConversions();
});

/* =========================================================================
   7. INIT
   ========================================================================= */

renderAll();
