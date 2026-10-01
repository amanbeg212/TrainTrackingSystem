/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        rail: {
          50: '#f4f7fc',
          100: '#e6edf7',
          200: '#d2e0f2',
          300: '#b1caea',
          400: '#89ace0',
          500: '#698bd7',
          600: '#526ecb',
          700: '#4458b6',
          800: '#3a4895',
          900: '#333e77',
          950: '#222849',
        },
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        glow: '0 0 20px rgba(99, 102, 241, 0.35)',
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        pulseSlow: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
