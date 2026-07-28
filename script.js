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

function formatNumber(n) {
  if (n === 0) return "0";
  const raw = Number(n.toPrecision(8));
  return raw.toLocaleString("fullwide", { useGrouping: false, maximumSignificantDigits: 8 });
}

function convert(value, from, to) {
  return to.fromBase(from.toBase(value));
}

function render() {
  const cats = Object.keys(categories);
  const units = categories[activeCategory].units;

  const tabs = document.getElementById("tabs");
  tabs.innerHTML = "";
  cats.forEach((name) => {
    const btn = document.createElement("button");
    btn.textContent = name.toUpperCase();
    btn.dataset.category = name;
    if (name === activeCategory) btn.classList.add("active");
    tabs.appendChild(btn);
  });

  const fromSelect = document.getElementById("fromUnit");
  const toSelect = document.getElementById("toUnit");
  fromSelect.innerHTML = "";
  toSelect.innerHTML = "";
  units.forEach((u, i) => {
    const fOpt = document.createElement("option");
    fOpt.value = i;
    fOpt.textContent = u.label;
    if (u === fromUnit) fOpt.selected = true;
    fromSelect.appendChild(fOpt);

    const tOpt = document.createElement("option");
    tOpt.value = i;
    tOpt.textContent = u.label;
    if (u === toUnit) tOpt.selected = true;
    toSelect.appendChild(tOpt);
  });

  const result = convert(fromValue, fromUnit, toUnit);
  document.getElementById("toValue").textContent = formatNumber(result);

  document.getElementById("formula").textContent =
    fromValue + " " + fromUnit.label + " = " + formatNumber(result) + " " + toUnit.label;

  document.getElementById("allHeaderValue").textContent =
    fromValue + " " + fromUnit.label;

  const allList = document.getElementById("allList");
  allList.innerHTML = "";
  units.forEach((u) => {
    if (u === fromUnit) return;
    const li = document.createElement("li");
    li.dataset.label = u.label;

    const nameSpan = document.createElement("span");
    nameSpan.textContent = u.label;
    const valSpan = document.createElement("span");
    valSpan.textContent = formatNumber(convert(fromValue, fromUnit, u));

    li.appendChild(nameSpan);
    li.appendChild(valSpan);
    if (u === toUnit) li.classList.add("active");
    allList.appendChild(li);
  });
}

document.getElementById("tabs").addEventListener("click", (event) => {
  const name = event.target.dataset.category;
  if (!name) return;
  activeCategory = name;
  fromUnit = categories[name].units[0];
  toUnit = categories[name].units[1];
  fromValue = 1;
  render();
});

document.getElementById("fromValue").addEventListener("input", (event) => {
  fromValue = Number(event.target.value) || 0;
  render();
});

document.getElementById("fromUnit").addEventListener("change", (event) => {
  fromUnit = categories[activeCategory].units[event.target.value];
  render();
});

document.getElementById("toUnit").addEventListener("change", (event) => {
  toUnit = categories[activeCategory].units[event.target.value];
  render();
});

document.getElementById("swapBtn").addEventListener("click", () => {
  [fromUnit, toUnit] = [toUnit, fromUnit];
  render();
});

render();
