/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mineral: 'var(--c-mineral)',
        ink: 'var(--c-ink)',
        concrete: 'var(--c-concrete)',
        sand: 'var(--c-sand)',
        olive: 'var(--c-olive)',
        paper: 'var(--c-paper)',
        line: 'var(--c-line)',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Cormorant"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['"Manrope Variable"', 'Manrope', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      fontSize: {
        micro: ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.14em' }],
      },
      transitionTimingFunction: {
        nord: 'cubic-bezier(0.76, 0, 0.24, 1)',
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      screens: { xs: '400px', '3xl': '1920px' },
    },
  },
  plugins: [],
};
