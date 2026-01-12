/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A",   // dark slate
        accent: "#2563EB",    // blue CTA
        background: "#020617",
        muted: "#020617",
        "muted-foreground": "#9CA3AF",
        border: "#1F2937"
      }
    }
  },
  plugins: []
}
