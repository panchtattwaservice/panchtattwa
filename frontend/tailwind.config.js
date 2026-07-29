/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        "bg-deep":    "#111009",
        "bg-mid":     "#181510",
        "bg-card":    "#1e1a14",
        cream:        "#ede8df",
        "cream-dim":  "#b8af9f",
        gold:         "#c8883a",
        "gold-light": "#ddb06a",
        terra:        "#b85c32",
        "terra-light":"#c97848",
        border:       "#3a3428",
        background:   "#111009",
        foreground:   "#ede8df",
        card: {
          DEFAULT:    "#1e1a14",
          foreground: "#ede8df",
        },
        primary: {
          DEFAULT:    "#ddb06a",
          foreground: "#111009",
        },
        secondary: {
          DEFAULT:    "#181510",
          foreground: "#ede8df",
        },
        accent: {
          DEFAULT:    "#b85c32",
          foreground: "#ede8df",
        },
        destructive: {
          DEFAULT:    "hsl(0 62.8% 30.6%)",
          foreground: "#ede8df",
        },
        input:  "#3a3428",
        ring:   "#c8883a",
        muted: {
          DEFAULT:    "#1e1a14",
          foreground: "#b8af9f",
        },
        popover: {
          DEFAULT:    "#1e1a14",
          foreground: "#ede8df",
        },
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans:  ["'DM Sans'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
