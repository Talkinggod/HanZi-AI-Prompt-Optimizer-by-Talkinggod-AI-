import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#1e40af',
        'brand-secondary': '#1d4ed8',
        'brand-accent': '#3b82f6',
        'brand-light': '#dbeafe',
        'brand-dark': '#1e293b',
        'brand-darker': '#0f172a',
        'brand-text': '#e2e8f0',
        'brand-subtle': '#94a3b8',
      },
    },
  },
  plugins: [],
} satisfies Config;