/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#050507',
          900: '#0A0A0F',
          850: '#0F0F16',
          800: '#14141D',
          700: '#1C1C28',
          600: '#252533',
          500: '#333344',
          400: '#4A4A5E',
        },
        accent: {
          DEFAULT: '#7C6FFF',
          hover: '#6450F0',
          soft: '#9B8FFF',
          glow: 'rgba(124, 111, 255, 0.35)',
        },
        success: '#3DD68C',
        warning: '#FFB547',
        error: '#FF5470',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(124, 111, 255, 0.3)',
        'glow-lg': '0 0 48px rgba(124, 111, 255, 0.25)',
        card: '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 16px rgba(124, 111, 255, 0.2)' },
          '50%': { boxShadow: '0 0 32px rgba(124, 111, 255, 0.45)' },
        },
      },
    },
  },
  plugins: [],
};