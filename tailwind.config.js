/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lane: {
          rule: {
            bg: '#F0FDFA',
            border: '#0D9488',
            text: '#115E59',
            badge: '#CCFBF1'
          },
          ml: {
            bg: '#FFFBEB',
            border: '#D97706',
            text: '#B45309',
            badge: '#FEF3C7'
          },
          review: {
            bg: '#EEF2FF',
            border: '#6366F1',
            text: '#4338CA',
            badge: '#E0E7FF'
          }
        },
        ops: {
          surface: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          textMuted: '#64748B',
          textDark: '#0F172A',
          primary: '#2563EB',
          success: '#16A34A',
          warning: '#EA580C',
          danger: '#DC2626'
        }
      },
      fontSize: {
        '2xs': '0.6875rem', // 11px for dense operations tables
      },
      spacing: {
        '4.5': '1.125rem',
      }
    },
  },
  plugins: [],
}
