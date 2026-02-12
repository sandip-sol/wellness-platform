import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './lib/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#2C5F4D', // Deep Sage
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#A4B494', // Soft Sage
          foreground: '#1A1A2E',
        },
        accent: {
          DEFAULT: '#D88C5E', // Clay
          foreground: '#FFFFFF',
        },
        sage: {
          50: '#F4F7F5',
          100: '#E9EFE9',
          200: '#C8D9C9',
          300: '#A4B494',
          400: '#7A9178',
          500: '#5C7A5E',
          600: '#2C5F4D',
          700: '#244D3F',
          800: '#1C3B31',
          900: '#122620',
        },
        ocean: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        sand: {
          50: '#FDFBF7',
          100: '#F9F5EC',
          200: '#F2EBD9',
          300: '#E6DBC0',
          400: '#D9C8A3',
          500: '#C6B286',
          600: '#A69268',
          700: '#877450',
          800: '#69593C',
          900: '#4D402A',
        },
        clay: {
          50: '#FEF9F6',
          100: '#FDEEE6',
          200: '#FBD5C5',
          300: '#F7B79D',
          400: '#F29471',
          500: '#EA7249',
          600: '#D4562D',
          700: '#B03F1E',
          800: '#8E3218',
          900: '#6F2612',
        },
        // Safety component palette (AgeGate, QuickExit)
        'warm-charcoal': '#1A1A2E',
        'warm-gray': '#4A4A5A',
        'warm-light': '#8B8B9E',
        coral: {
          DEFAULT: '#EF4444',
          light: '#F87171',
          subtle: '#FEF2F2',
        },
        teal: {
          DEFAULT: '#2EC4B6',
          subtle: '#E8FAF8',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};

export default config;
