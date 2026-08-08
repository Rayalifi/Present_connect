/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        himatif: {
          dark: '#0A1128',
          navy: '#101F42',
          card: '#162854',
          border: '#243A73',
          primary: '#2563EB',
          accent: '#00D2FF',
          glow: 'rgba(0, 210, 255, 0.25)',
          muted: '#8E9EB8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(37, 99, 235, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(0, 210, 255, 0.4)',
        'glow-success': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'card-soft': '0 10px 30px -10px rgba(0, 0, 0, 0.07)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 2s linear infinite',
        'shimmer': 'shimmer 2s infinite'
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.2)', opacity: '0' }
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
  plugins: [],
}
