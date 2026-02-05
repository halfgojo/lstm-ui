/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'battery-normal': '#10b981',
        'battery-warning': '#f59e0b',
        'battery-critical': '#ef4444',
      },
    },
  },
  plugins: [],
}
