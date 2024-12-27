/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        myrtleGreen: '#317873',
        primroseYellow: '#f6d155',
        roseRed: '#FF033E'
      },
      fontSize: {
        "4.5xl":"2rem"
      }
    },
  },
  plugins: [],
};
