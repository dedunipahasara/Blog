/** @type {import('tailwindcss').Config} */
export default {
    // darkMode: 'class', // Enable dark mode using class
  content: [
    
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // include your source files here
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
