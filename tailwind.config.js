const { tokenNames } = require("./src/theme/colors");

// Cada color usa una variable CSS; los valores reales están en src/theme/colors.js
const colors = Object.fromEntries(tokenNames.map((name) => [name, `var(--${name})`]));

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class", // el modo oscuro se maneja con variables (src/theme/useTheme.ts)
  theme: { extend: { colors } },
  plugins: [],
};
