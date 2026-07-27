// Turns a plain multiplier (e.g. "1 mile = 1609.344 meters") into the
// toBase/fromBase pair every non-temperature unit needs.
function unit(label, factor) {
  return {
    label,
    toBase: (v) => v * factor,
    fromBase: (v) => v / factor,
  };
}

const categories = {
  Length: {
    base: "Meter",
    units: [
      unit("Meter", 1),
      unit("Kilometer", 1000),
      unit("Centimeter", 0.01),
      unit("Millimeter", 0.001),
      unit("Mile", 1609.344),
      unit("Yard", 0.9144),
      unit("Foot", 0.3048),
      unit("Inch", 0.0254),
    ],
  },
  Weight: {
    base: "Kilogram",
    units: [
      unit("Kilogram", 1),
      unit("Gram", 0.001),
      unit("Milligram", 0.000001),
      unit("Tonne", 1000),
      unit("Pound", 0.45359237),
      unit("Ounce", 0.028349523125),
      unit("Stone", 6.35029318),
    ],
  },
  Temperature: {
    base: "Celsius",
    units: [
      {
        label: "Celsius",
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      {
        label: "Fahrenheit",
        toBase: (v) => ((v - 32) * 5) / 9,
        fromBase: (v) => (v * 9) / 5 + 32,
      },
      {
        label: "Kelvin",
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
      },
    ],
  },
  Volume: {
    base: "Liter",
    units: [
      unit("Liter", 1),
      unit("Milliliter", 0.001),
      unit("Cubic Meter", 1000),
      unit("Gallon (US)", 3.785411784),
      unit("Quart (US)", 0.946352946),
      unit("Pint (US)", 0.473176473),
      unit("Cup (US)", 0.2365882365),
      unit("Fl. Oz (US)", 0.0295735295625),
    ],
  },
  Speed: {
    base: "m/s",
    units: [
      unit("m/s", 1),
      unit("km/h", 1000 / 3600),
      unit("mph", 0.44704),
      unit("Knot", 1852 / 3600),
      unit("ft/s", 0.3048),
    ],
  },
  Area: {
    base: "Sq. Meter",
    units: [
      unit("Sq. Meter", 1),
      unit("Sq. Kilometer", 1000000),
      unit("Sq. Centimeter", 0.0001),
      unit("Hectare", 10000),
      unit("Acre", 4046.8564224),
      unit("Sq. Mile", 2589988.110336),
      unit("Sq. Foot", 0.09290304),
    ],
  },
};

let activeCategory = "Length";
let fromUnit = categories.Length.units[0];
let toUnit = categories.Length.units[1];
let fromValue = 1;
