import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ==========================================
        // PALETA OFICIAL TRANSFORMACCION 720
        // ==========================================
        brand: {
          blue: '#0066FF',
          'blue-light': '#3385FF',
          'blue-dark': '#0052CC',
          green: '#00CC88',
          'green-light': '#00E59A',
          'green-dark': '#00A370',
          amber: '#FFB400',
          'amber-light': '#FFC733',
          'amber-dark': '#E0A000',
          charcoal: '#1C1C1C',
          cloud: '#F4F6F8',
          white: '#FFFFFF',
        },

        // Aliases directos (para uso rápido en JSX: bg-blue, text-charcoal, etc.)
        blue: '#0066FF',
        green: '#00CC88',
        amber: '#FFB400',
        charcoal: '#1C1C1C',
        cloud: '#F4F6F8',

        // Variables CSS dinámicas (tipado en tailwind)
        background: 'var(--bg-page)',
        surface: 'var(--bg-card)',
        foreground: 'var(--text-primary)',
        muted: 'var(--text-muted)',
        border: 'var(--border-default)',

        // Escala de grises custom (compatibilidad legacy)
        dark: {
          900: '#0A0A0A',
          800: '#1C1C1C',
          700: '#374151',
          600: '#4B5563',
          500: '#6B7280',
          400: '#9CA3AF',
          300: '#D1D5DB',
          200: '#E5E7EB',
          100: '#F4F6F8',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Space Grotesk', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-xl': ['3.75rem', { lineHeight: '1.08', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-sm': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-xs': ['1.5rem', { lineHeight: '1.35', fontWeight: '600' }],
        'body-xl': ['1.25rem', { lineHeight: '1.65' }],
        'body-lg': ['1.125rem', { lineHeight: '1.65' }],
        'body-md': ['1rem', { lineHeight: '1.65' }],
        'body-sm': ['0.875rem', { lineHeight: '1.55' }],
        'body-xs': ['0.75rem', { lineHeight: '1.5' }],
      },

      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      boxShadow: {
        'blue-glow': '0 4px 20px rgba(0, 102, 255, 0.20)',
        'blue-glow-lg': '0 8px 40px rgba(0, 102, 255, 0.30)',
        'green-glow': '0 4px 20px rgba(0, 204, 136, 0.20)',
        'amber-glow': '0 4px 20px rgba(255, 180, 0, 0.25)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.10)',
        'elevated': '0 16px 48px rgba(0, 0, 0, 0.12)',
      },

      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #0066FF 0%, #00CC88 100%)',
        'gradient-blue': 'linear-gradient(135deg, #0066FF 0%, #0052CC 100%)',
        'gradient-green': 'linear-gradient(135deg, #00CC88 0%, #00A370 100%)',
        'gradient-amber': 'linear-gradient(135deg, #FFB400 0%, #E0A000 100%)',
        'gradient-radial-blue': 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0, 102, 255, 0.08) 0%, transparent 70%)',
        'gradient-radial-green': 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0, 204, 136, 0.07) 0%, transparent 70%)',
      },

      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'marquee': 'marquee 20s linear infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 16px rgba(0, 102, 255, 0.15)' },
          '50%': { boxShadow: '0 0 32px rgba(0, 102, 255, 0.35)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
