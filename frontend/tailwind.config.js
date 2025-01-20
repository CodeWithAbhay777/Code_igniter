/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-thin": {
          scrollbarWidth: "thin",
          scrollbarColor: "white black",
        },
        ".scrollbar-webkit": {
          "&::-webkit-scrollbar": {
            width: "2px",
            height: "8px", 
          },
          "&::-webkit-scrollbar-track": {
            background: "black",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "white",
            borderRadius: "20px", 
            border: "2px solid black", 
          },
        },
      };
  
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
}