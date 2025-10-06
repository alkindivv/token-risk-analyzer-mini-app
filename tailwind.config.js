/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1E293B',
        'dark-card': '#334155',
        'dark-border': '#475569',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
