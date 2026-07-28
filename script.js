/*DATA*/
// Turns a plain multiplier (e.g. "1 mile = 1609.344 meters") into the
// toBase/fromBase pair every non-temperature unit needs.
function unit(label, factor) {
  return {
    label, // shorthand for label: label - when the property name and variable name match, you can skip repeating it. Called "property shorthand"
    
    // factor is a paramater - normally you'd expect it to disappear after unit() finishes running. But due to the arrow functions ==> we get closure. So these arrow functions remember factor even after unit() has already returned. That's why we don't need to pasa factor around seperately everywhere.
    toBase: (v) => v * factor,
    fromBase: (v) => v / factor,
  };
}

/* Nested object structure. 3 levels deep. Categories -> Type of units -> Units array -> Units with factors*/
const categories = {
  Length: {
    base: "Meter",
    units: [
      unit("Meter", 1), // each call runs unit() fresh - every uni gets its OWN seperate closure over its own factor. 
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
      { // Celsius IS the base unit for this category. So we essentially do nothing. Convert it to itself.
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
/*State*/

let activeCategory = "Length";
let fromUnit = categories.Length.units[0]; //The base unit (default display)  
let toUnit = categories.Length.units[1]; //(Default display on two - always the second unit in list)
let fromValue = 1;

/* The guard clause pattern - Guard clause - handle the special case (0) 1st and exit early. AKA checking for an edge case right at the top and returning immediately.*/
function formatNumber(n) {
  if (n === 0) return "0";
  const raw = Number(n.toPrecision(8));
  return raw.toLocaleString("fullwide", { useGrouping: false, maximumSignificantDigits: 8 });
}
/* from and to aren't plain values like value is - they're whole unit objects. built way back in the unit() piece. So this function's entire job is to call methods that already lives on them. */
function convert(value, from, to) {
  return to.fromBase(from.toBase(value)); //Converts to base value first and then to the unit we want
}

function render() {
  const cats = Object.keys(categories); // Categories is an object and objects aren't directly loop-able with forEach. So we use Object.keys(). It looks at an object and hands back an array of just its property names as strings - ["Length", "Weight", "Temperature", "Volume", "Speed", "Area"]
  const units = categories[activeCategory].units; // Grab the units array for the currently active category so we can render the dropdowns and conversion results.

  const tabs = document.getElementById("tabs"); // 1st time JS touches the page. Grabs the <nav id="tabs">. 
  tabs.innerHTML = ""; // Clear out the tabs so we can re-render them. This is important because we don't want to keep adding more and more buttons every time render() runs. We want to start fresh each time.
  cats.forEach((name) => { // Loop through the array of category. "name" is whichever category we're currently on. So first time through it's "Length", 2nd time it's "Weight", etc.
    const btn = document.createElement("button"); // creates a real button element but only in memory. its not visible on the page until something attaches it. 
    btn.textContent = name.toUpperCase();
    btn.dataset.category = name; //data-* attributes: a way to stash info ON an element for JS to read back later - invisible to the user. not for styling. it exists so that later, when someone clicks this button, the click handler can ask "which category does this specific button represent?" and the answer is right there in the button's dataset.
    if (name === activeCategory) btn.classList.add("active"); //classlist - a whole mini-API for adding/removing/toggling classes on an element.
    tabs.appendChild(btn);
  });

  const fromSelect = document.getElementById("fromUnit");
  const toSelect = document.getElementById("toUnit");
  fromSelect.innerHTML = ""; //same logic as the tabs. Clear out the dropdowns so we can re-render them. Otherwise, every time render() runs, we keep adding more and more options to the dropdowns. render() runs repeatedly and w/o this swtiching from Length ot Weight would leave Length's units in the dropdowns even after switching to Weight. So we clear them out first.
  toSelect.innerHTML = "";
  units.forEach((u, i) => { // u is the unit object, i is the index of that unit in the array. We need the index to set the value of the <option> so we can look it up later when the user changes the dropdown.
    /* One loop, two dropdowns - for each unit, build a matching option for BOTH fromSelect and toSelect at once. Worth notiing the efficienty choice here.*/
    const fOpt = document.createElement("option");
    /*form elements often seperate what's displayed to a human from what's actually used by code. A person sees Kilometer, but the browser is tracking 1 as its real value*/
    fOpt.value = i; // value - what the PROGRAM reads back (array index - ex: "1" for Kilometer)
    fOpt.textContent = u.label; // textContent - what the USER sees (readable name - "Kilometer")
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
    if (u === fromUnit) return; // Don't show the unit we're converting from in the "all" list. It would be redundant.
    const li = document.createElement("li");
    li.dataset.label = u.label;
    /* Build the whole row (li + its two spans) fully in memory first then attach the finished row to the page in one go */
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
/* Event delegation: ONE listener on TABS not one per button - necessary b/c render() destriys and recreates buttons every time. Listening on the stable parent (tabs) itself which never gets destroys. Clicks on children automatically bubble up to be heard by the parent anyway.*/
document.getElementById("tabs").addEventListener("click", (event) => {
  const name = event.target.dataset.category; //event.targe - whichever exact button was clicked. dataset.category - the data-* attribute we added to each button in render() so we can read it back here.
  if (!name) return;
  activeCategory = name;
  /* Fresh reset state whenever we click a new tab */
  fromUnit = categories[name].units[0];
  toUnit = categories[name].units[1];
  fromValue = 1;
  render();
});

document.getElementById("fromValue").addEventListener("input", (event) => {
  fromValue = Number(event.target.value) || 0; // Fallback pattern - if the user types something that can't be converted to a number, we fall back to 0. This prevents NaN from showing up in the results.
  render();
});

document.getElementById("fromUnit").addEventListener("change", (event) => {
  fromUnit = categories[activeCategory].units[event.target.value]; // This is why we set the <option> value to the index of the unit in render() [fOpt.value = i] - so we can look it up here when the user changes the dropdown.
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

document.getElementById("allList").addEventListener("click", (event) => {
  const row = event.target.closest("li"); //closest() walks UP from the DOM from whatever was clicked looking for the nearest ancestor matching "li" - needed because a click might land on a child <span> not the <li> itself. Tab/dropdown listeners didn't need this b/c tab buttons contain nothing but plain text so event.target was always the button itself. Each All Conversions row contains 2 <span> children so a click could land on either of them. 
  if (!row) return;
  toUnit = categories[activeCategory].units.find((u) => u.label === row.dataset.label); 
  render();
});

render();
