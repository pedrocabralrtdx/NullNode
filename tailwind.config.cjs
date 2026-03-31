module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          950: '#000000',
          900: '#070707',
          800: '#0e0e0e',
          700: '#151515'
        },
        neon: {
          green: '#7CFF9B',
          blue: '#7CFF9B',
          red: '#7CFF9B',
          gray: '#9aa0a6'
        }
      },
      fontFamily: {
        display: ['"Orbitron"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        tech: ['"Share Tech Mono"', 'monospace']
      },
      boxShadow: {
        neon: '0 0 14px rgba(0, 255, 65, 0.25)',
        neonStrong: '0 0 22px rgba(0, 255, 65, 0.4)',
        panel: '0 12px 30px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.08)'
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at top, rgba(0, 255, 65, 0.1), transparent 60%)'
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' }
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 14px rgba(0, 255, 65, 0.25)' },
          '50%': { boxShadow: '0 0 22px rgba(0, 255, 65, 0.45)' }
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' }
        },
        scanline: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' }
        }
      },
      animation: {
        flicker: 'flicker 2.5s infinite',
        glow: 'glowPulse 3s ease-in-out infinite',
        glitch: 'glitch 0.35s infinite',
        scanline: 'scanline 12s linear infinite'
      }
    }
  },
  plugins: []
}
