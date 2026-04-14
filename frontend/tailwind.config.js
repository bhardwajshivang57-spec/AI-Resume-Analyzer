/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#ec4899',
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827'
        }
      },
      backdropBlur: {
        glass: '10px',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'gradient-warm': 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        slideIn: {
          'from': { transform: 'translateX(-100%)', opacity: 0 },
          'to': { transform: 'translateX(0)', opacity: 1 }
        },
        fadeIn: {
          'from': { opacity: 0 },
          'to': { opacity: 1 }
        },
        scaleIn: {
          'from': { transform: 'scale(0.95)', opacity: 0 },
          'to': { transform: 'scale(1)', opacity: 1 }
        }
      }
    },
  },
  plugins: [],
}
