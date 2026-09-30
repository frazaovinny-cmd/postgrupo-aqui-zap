/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          DEFAULT: '#53e515',
          soft: '#7ef05a',
          deep: '#3bb70c',
        },
        primary: {
          DEFAULT: '#101441',
          400: '#1b2258',
          500: '#232c6e',
          600: '#2e3885',
        },
        support: {
          DEFAULT: '#152237',
          400: '#1c2c45',
          500: '#243853',
        },
        base: {
          DEFAULT: '#161313',
          800: '#1e1a1a',
          700: '#262121',
          600: '#312a2a',
        },
        ink: {
          DEFAULT: '#53e515',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      screens: {
        xs: '320px',
        sm: '768px',
        md: '1024px',
        lg: '1280px',
        xl: '1536px',
      },
      boxShadow: {
        neon: '0 0 0 1px rgba(83,229,21,0.35), 0 8px 32px -8px rgba(83,229,21,0.45)',
        'neon-sm': '0 0 12px -2px rgba(83,229,21,0.45)',
        card: '0 12px 40px -16px rgba(0,0,0,0.75)',
        lift: '0 24px 60px -24px rgba(0,0,0,0.9)',
      },
      backgroundImage: {
        'grid-neon':
          'linear-gradient(rgba(83,229,21,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(83,229,21,0.07) 1px, transparent 1px)',
        'glow-primary': 'radial-gradient(60% 60% at 50% 0%, rgba(16,20,65,0.9) 0%, rgba(22,19,19,0) 100%)',
      },
      backgroundSize: {
        grid: '32px 32px',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(83,229,21,0.45)' },
          '70%': { boxShadow: '0 0 0 12px rgba(83,229,21,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(83,229,21,0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out both',
        'fade-up': 'fade-up 0.45s ease-out both',
        'scale-in': 'scale-in 0.25s ease-out both',
        shimmer: 'shimmer 1.6s infinite',
        'pulse-ring': 'pulse-ring 2s infinite',
        marquee: 'marquee 28s linear infinite',
        float: 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}