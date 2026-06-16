/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Russo One"', 'system-ui', 'sans-serif'],
        sans: ['Rubik', 'system-ui', 'sans-serif'],
      },
      colors: {
        studio: {
          950: '#08080c',
          900: '#0b0b11',
          800: '#14141d',
          700: '#1d1d29',
          600: '#272736',
          500: '#343445',
        },
        neon: {
          amber: '#fbbf24',
          orange: '#fb923c',
        },
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(251, 146, 60, 0.45)',
        stamp: '0 8px 0 0 rgba(0,0,0,0.35)',
      },
      keyframes: {
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        equalize: {
          '0%, 100%': { transform: 'scaleY(0.35)' },
          '50%': { transform: 'scaleY(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '45%': { opacity: '0.85' },
          '50%': { opacity: '0.4' },
          '55%': { opacity: '0.9' },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 6s linear infinite',
        equalize: 'equalize 0.9s ease-in-out infinite',
        float: 'float 5s ease-in-out infinite',
        flicker: 'flicker 4s linear infinite',
      },
    },
  },
  plugins: [],
}
