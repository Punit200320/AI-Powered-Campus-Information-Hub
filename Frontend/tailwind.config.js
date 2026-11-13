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
        primary: {
          50: '#f4f6f0',
          100: '#e5ebdd',
          200: '#cdd8bf',
          300: '#acbe95',
          400: '#8ba56d',
          500: '#6f8f55',
          600: '#587244',
          700: '#46593a',
          800: '#3a4831',
          900: '#323d2c',
          950: '#1a2118',
        },
        secondary: {
          50: '#fdf4ef',
          100: '#fae6da',
          200: '#f3ccb5',
          300: '#e9a884',
          400: '#df824f',
          500: '#d96835',
          600: '#c2522a',
          700: '#a14224',
          800: '#823522',
          900: '#692c20',
        },
        electric: {
          blue: '#2563eb',
          cyan: '#0ea5a4',
          sky: '#38bdf8',
        },
        warm: {
          50: '#fbfaf8',
          100: '#f5f2ec',
          200: '#e7e2d8',
          300: '#d6cfc0',
          400: '#b4aa97',
          500: '#948a77',
          600: '#6f6657',
          700: '#575041',
          800: '#3a352c',
          900: '#262219',
        },
        dark: {
          bg: '#0e1220',
          surface: '#151b2e',
          card: '#1a2138',
          border: '#283050',
          muted: '#9aa5c0',
        },
        light: {
          bg: '#faf9f6',
          surface: '#ffffff',
          card: '#ffffff',
          border: '#e8e4dc',
          muted: '#6f6a5e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'Cambria', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(111, 114, 68, 0.20)',
        'glow': '0 0 25px -5px rgba(111, 114, 68, 0.28)',
        'glow-lg': '0 0 40px -8px rgba(111, 114, 68, 0.32)',
        'glow-cyan': '0 0 25px -5px rgba(14, 165, 164, 0.25)',
        'premium': '0 20px 25px -5px rgba(40, 30, 20, 0.06), 0 8px 10px -6px rgba(40, 30, 20, 0.04)',
        'premium-dark': '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        shimmer: 'shimmer 1.5s infinite',
      }
    },
  },
  plugins: [],
}
