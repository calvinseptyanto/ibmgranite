/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{html,js,ts,jsx,tsx}", // Scan the entire 'app' directory
    "./app/components/**/*.{js,jsx}", // Specifically for JS and JSX files inside components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}