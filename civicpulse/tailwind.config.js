/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          dark: '#090A0F',
          surface: '#12141D',
          border: '#1F2430',
          hover: '#181C28',
          accent: '#FF4500', // Civic Orange
          blue: '#3B82F6',   // Trust Blue
          green: '#10B981',  // Resolved Green
          red: '#EF4444',    // Critical Alert Red
          text: '#F3F4F6',
          muted: '#9CA3AF'
        }
      }
    },
  },
  plugins: [],
}
