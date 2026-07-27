/* =========================================================================
   SECTION 1: DATA
   -------------------------------------------------------------------------
   Every category picks one "base" unit as a neutral middle ground
   (e.g. Meter for Length). Every unit knows two things:
     toBase(value)   -> convert FROM this unit INTO the base unit
     fromBase(value) -> convert FROM the base unit INTO this unit

   Converting between ANY two units in a category becomes a two-step trip:
     base   = fromUnit.toBase(inputValue)
     result = toUnit.fromBase(base)
   This one pattern also covers Temperature, whose formulas aren't simple
   multiplication (see celsius/fahrenheit/kelvin below).
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
    defaultTo: 'gram',
    units: [
      { id: 'kilogram',  label: 'Kilogram',   toBase: v => v * 1000,     fromBase: v => v / 1000 },
      { id: 'gram',      label: 'Gram',       toBase: v => v,            fromBase: v => v },
      { id: 'milligram', label: 'Milligram',  toBase: v => v * 0.001,    fromBase: v => v / 0.001 },
      { id: 'tonne',     label: 'Tonne',      toBase: v => v * 1000000,  fromBase: v => v / 1000000 },
      { id: 'pound',     label: 'Pound',      toBase: v => v * 453.592,  fromBase: v => v / 453.592 },
      { id: 'ounce',     label: 'Ounce',      toBase: v => v * 28.3495,  fromBase: v => v / 28.3495 },
      { id: 'stone',     label: 'Stone',      toBase: v => v * 6350.29,  fromBase: v => v / 6350.29 },
    ],
  },
  {
    id: 'temperature',
    label: 'Temperature',
    defaultFrom: 'celsius',
    defaultTo: 'fahrenheit',
    units: [
      { id: 'celsius',    label: 'Celsius',    toBase: v => v,                fromBase: v => v },
      { id: 'fahrenheit', label: 'Fahrenheit', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
      { id: 'kelvin',     label: 'Kelvin',     toBase: v => v - 273.15,       fromBase: v => v + 273.15 },
    ],
  },
  {
    id: 'volume',
    label: 'Volume',
    defaultFrom: 'liter',
    defaultTo: 'milliliter',
    units: [
      { id: 'liter',      label: 'Liter',       toBase: v => v,              fromBase: v => v },
      { id: 'milliliter', label: 'Milliliter',  toBase: v => v * 0.001,      fromBase: v => v / 0.001 },
      { id: 'cubicMeter', label: 'Cubic Meter', toBase: v => v * 1000,       fromBase: v => v / 1000 },
      { id: 'gallon',     label: 'Gallon (US)', toBase: v => v * 3.78541,    fromBase: v => v / 3.78541 },
      { id: 'quart',      label: 'Quart (US)',  toBase: v => v * 0.946353,   fromBase: v => v / 0.946353 },
      { id: 'pint',       label: 'Pint (US)',   toBase: v => v * 0.473176,   fromBase: v => v / 0.473176 },
      { id: 'cup',        label: 'Cup (US)',    toBase: v => v * 0.236588,   fromBase: v => v / 0.236588 },
      { id: 'flOunce',    label: 'Fl. Oz (US)', toBase: v => v * 0.0295735,  fromBase: v => v / 0.0295735 },
    ],
  },
  {
    id: 'speed',
    label: 'Speed',
    defaultFrom: 'meterPerSecond',
    defaultTo: 'kilometerPerHour',
    units: [
      { id: 'meterPerSecond',   label: 'm/s',  toBase: v => v,             fromBase: v => v },
      { id: 'kilometerPerHour', label: 'km/h', toBase: v => v * 0.277778,  fromBase: v => v / 0.277778 },
      { id: 'milePerHour',      label: 'mph',  toBase: v => v * 0.44704,   fromBase: v => v / 0.44704 },
      { id: 'knot',             label: 'Knot', toBase: v => v * 0.514444,  fromBase: v => v / 0.514444 },
      { id: 'footPerSecond',    label: 'ft/s', toBase: v => v * 0.3048,    fromBase: v => v / 0.3048 },
    ],
  },
  {
    id: 'area',
    label: 'Area',
    defaultFrom: 'squareMeter',
    defaultTo: 'squareKilometer',
    units: [
      { id: 'squareMeter',     label: 'Sq. Meter',     toBase: v => v,               fromBase: v => v },
      { id: 'squareKilometer', label: 'Sq. Kilometer', toBase: v => v * 1000000,     fromBase: v => v / 1000000 },
      { id: 'squareCentimeter',label: 'Sq. Centimeter',toBase: v => v * 0.0001,      fromBase: v => v / 0.0001 },
      { id: 'hectare',         label: 'Hectare',       toBase: v => v * 10000,       fromBase: v => v / 10000 },
      { id: 'acre',            label: 'Acre',          toBase: v => v * 4046.86,     fromBase: v => v / 4046.86 },
      { id: 'squareMile',      label: 'Sq. Mile',      toBase: v => v * 2589988.11,  fromBase: v => v / 2589988.11 },
      { id: 'squareFoot',      label: 'Sq. Foot',      toBase: v => v * 0.092903,    fromBase: v => v / 0.092903 },
    ],
  },
];
