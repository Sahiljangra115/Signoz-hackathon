/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#050505',
        panel: '#0e0f12',
        ink: '#f2f2f0',
        alien: '#39ff14',
        amber: '#ffb000',
        danger: '#ff2f2f',
        edge: '#1c1e22',
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        display: ['"Barlow Condensed"', 'sans-serif'],
      },
      letterSpacing: { agency: '0.18em' },
      boxShadow: {
        glow: '0 0 8px rgba(57,255,20,0.35), 0 0 24px rgba(57,255,20,0.12)',
        'glow-strong': '0 0 12px rgba(57,255,20,0.55), 0 0 36px rgba(57,255,20,0.20)',
        'glow-amber': '0 0 8px rgba(255,176,0,0.45), 0 0 20px rgba(255,176,0,0.15)',
        'glow-danger': '0 0 10px rgba(255,47,47,0.55), 0 0 28px rgba(255,47,47,0.20)',
      },
      keyframes: {
        'radar-spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        'blink-hard': { '0%,49%': { opacity: '1' }, '50%,100%': { opacity: '0.15' } },
        'pulse-soft': { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.45' } },
      },
      animation: {
        'radar-spin': 'radar-spin 4s linear infinite',
        'blink-hard': 'blink-hard 1s step-end infinite',
        'pulse-soft': 'pulse-soft 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
