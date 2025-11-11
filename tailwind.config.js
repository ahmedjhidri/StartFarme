/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D8B3C',
          dark: '#1E6029',
          light: '#4CAF50',
        },
        secondary: '#8D6E63',
        accent: '#FF9800',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3',
      },
    },
  },
  plugins: [],
}

