/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          bg: '#f0f9ff',
          card: '#ffffff',
          primary: '#0ea5e9',
          text: '#1e293b',
          secondary: '#64748b',
        },
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
          primary: '#38bdf8',
          text: '#f1f5f9',
          secondary: '#94a3b8',
        }
      }
    },
  },
  plugins: [],
}
