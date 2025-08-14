/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#1E3A5F', // deep-navy
        'primary-foreground': '#FFFFFF', // white
        
        // Secondary Colors
        'secondary': '#4A90A4', // blue-gray
        'secondary-foreground': '#FFFFFF', // white
        
        // Accent Colors
        'accent': '#E67E22', // warm-orange
        'accent-foreground': '#FFFFFF', // white
        
        // Background Colors
        'background': '#FAFBFC', // off-white
        'surface': '#FFFFFF', // white
        
        // Text Colors
        'text-primary': '#2C3E50', // dark-blue-gray
        'text-secondary': '#7F8C8D', // medium-gray
        
        // Status Colors
        'success': '#27AE60', // professional-green
        'success-foreground': '#FFFFFF', // white
        'warning': '#F39C12', // balanced-amber
        'warning-foreground': '#FFFFFF', // white
        'error': '#E74C3C', // clear-red
        'error-foreground': '#FFFFFF', // white
        
        // Border Colors
        'border': 'rgba(0, 0, 0, 0.1)', // subtle-border
        'border-accent': 'rgba(0, 0, 0, 0.2)', // accent-border
      },
      fontFamily: {
        'heading': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'caption': ['Inter', 'system-ui', 'sans-serif'],
        'data': ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontWeight: {
        'heading-normal': '400',
        'heading-medium': '500',
        'heading-semibold': '600',
        'body-normal': '400',
        'body-medium': '500',
        'data-normal': '400',
      },
      boxShadow: {
        'base': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'interactive': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'modal': '0 8px 24px rgba(0, 0, 0, 0.2)',
      },
      spacing: {
        '60': '15rem', // 240px for sidebar width
      },
      zIndex: {
        'navigation': '100',
        'dropdown': '200',
        'modal': '300',
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.8',
          },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}