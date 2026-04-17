/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-elevated': 'var(--color-surface-elevated)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        border: 'var(--color-border)',
        primary: 'var(--color-primary)',
        'primary-muted': 'var(--color-primary-muted)',
        
        // Legacy colors kept temporarily for transition
        night: {
          950: '#000000',
          900: '#070707',
          800: '#0e0e0e',
          700: '#151515'
        },
        neon: {
          green: '#7CFF9B'
        }
      },
      fontFamily: {
        display: ['"Orbitron"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        tech: ['"Share Tech Mono"', 'monospace']
      },
      boxShadow: {
        neon: 'var(--shadow-neon)',
        strong: '0 0 22px var(--color-primary-muted)',
        panel: 'var(--shadow-panel)'
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at top, var(--color-primary-muted), transparent 60%)'
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' }
        },
        glowPulse: {
          '0%, 100%': { boxShadow: 'var(--shadow-neon)' },
          '50%': { boxShadow: '0 0 22px var(--color-primary-muted)' }
        }
      },
      animation: {
        flicker: 'flicker 2.5s infinite',
        glow: 'glowPulse 3s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
