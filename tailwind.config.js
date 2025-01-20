/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all files in the src directory
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors (optional, add more as needed)
        primary: "#4F46E5", // Indigo
        secondary: "#9333EA", // Purple
        accent: "#3B82F6", // Blue
      },
      fontFamily: {
        // Custom fonts (optional, add more as needed)
        sans: ["Inter", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
    },
  },
  plugins: [],
};
