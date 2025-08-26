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
        'dark': {
          900: '#0a0a0a',
          800: '#1a1a1a',
          700: '#2a2a2a',
          600: '#3a3a3a',
          500: '#4a4a4a',
        },
        'light': {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
        },
        'orange': {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        }
      },
      boxShadow: {
        'orange-glow': '0 0 20px rgba(249, 115, 22, 0.3)',
        'orange-glow-lg': '0 0 40px rgba(249, 115, 22, 0.4)',
        'dark-card': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'light-card': '0 4px 16px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)',
        'light-gradient': 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 50%, #e5e5e5 100%)',
        'orange-gradient': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      }
    },
  },
  plugins: [],
}
