/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#000000',
        panel: '#0b0c0e',
        card: '#101215',
        ink: '#f2f2f0',
        alien: '#39ff14',
        aqua: '#0affc2',
        cyan: '#22d3ee',
        amber: '#ffb000',
        danger: '#ff2f2f',
        edge: '#1c1e22',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        display: ['"Barlow Condensed"', 'sans-serif'],
        stat: ['"Space Grotesk"', '"Barlow Condensed"', 'sans-serif'],
      },
      letterSpacing: { agency: '0.18em' },
      borderRadius: { xl: '0.9rem', '2xl': '1.25rem' },
      backgroundImage: {
        beam: 'linear-gradient(135deg,#39ff14 0%,#0affc2 55%,#22d3ee 100%)',
        'beam-soft': 'linear-gradient(160deg,rgba(57,255,20,0.10),rgba(34,211,238,0.04))',
        'card-sheen': 'linear-gradient(160deg,rgba(255,255,255,0.04),rgba(255,255,255,0) 55%)',
      },
      boxShadow: {
        glow: '0 0 8px rgba(57,255,20,0.35), 0 0 24px rgba(57,255,20,0.12)',
        'glow-strong': '0 0 12px rgba(57,255,20,0.55), 0 0 36px rgba(57,255,20,0.20)',
        'glow-amber': '0 0 8px rgba(255,176,0,0.45), 0 0 20px rgba(255,176,0,0.15)',
        'glow-danger': '0 0 10px rgba(255,47,47,0.55), 0 0 28px rgba(255,47,47,0.20)',
        card: '0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 40px -24px rgba(0,0,0,0.9)',
        'card-lift': '0 0 0 1px rgba(57,255,20,0.20), 0 24px 50px -20px rgba(0,0,0,0.9), 0 0 32px -6px rgba(57,255,20,0.15)',
      },
      keyframes: {
        'radar-spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        'blink-hard': { '0%,49%': { opacity: '1' }, '50%,100%': { opacity: '0.15' } },
        'pulse-soft': { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.45' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        'radar-spin': 'radar-spin 4s linear infinite',
        'blink-hard': 'blink-hard 1s step-end infinite',
        'pulse-soft': 'pulse-soft 1.4s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
      },
    },
  },
  plugins: [],
}
