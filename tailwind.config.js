/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0A0C10',
          900: '#12151C',
          800: '#1A1E27',
          700: '#252A36',
          600: '#333A49',
        },
        parchment: {
          50: '#FBF9F4',
          100: '#F4EFE3',
          200: '#E9E0CC',
        },
        gilt: {
          400: '#C9A667',
          500: '#B08D4F',
          600: '#8F7038',
        },
        signal: {
          success: '#5C8A6B',
          error: '#B5544B',
          warn: '#C99A3E',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '14px',
      },
      boxShadow: {
        card: '0 20px 60px -20px rgba(0,0,0,0.45)',
        ring: '0 0 0 1px rgba(201,166,103,0.35)',
      },
      keyframes: {
        drawCheck: {
          '0%': { strokeDashoffset: '48' },
          '100%': { strokeDashoffset: '0' },
        },
        ringPop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        drawCheck: 'drawCheck 0.55s ease-out 0.15s forwards',
        ringPop: 'ringPop 0.5s cubic-bezier(0.2,0.9,0.3,1.2) forwards',
        fadeUp: 'fadeUp 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
};
