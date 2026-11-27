/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        civic: {
          dark: '#0B0D12',
          surface: '#12151D',
          raised: '#171B25',
          border: '#232837',
          hover: '#1C2130',
          accent: '#F5622D',
          blue: '#4C8DF6',
          green: '#22C08A',
          red: '#EF5350',
          amber: '#F5A524',
          text: '#F3F4F6',
          muted: '#A1A8B8',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,.4), 0 8px 24px -12px rgba(0,0,0,.5)',
      },
    },
  },
  plugins: [],
}
