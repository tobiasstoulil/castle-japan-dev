/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#000000",
        main: "rgb(158 132 102 / 70%)",
      },

      screens: {
        smX: "874px",
        lgx: "1140px",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".font-main": {
          fontFamily: "DM Sans",
          textTransform: "uppercase",
          fontWeight: "400",
          lineHeight: "1",
          // letterSpacing: "-0.025em",
        },
      };

      addUtilities(newUtilities);
    },
  ],
};
