const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors:{
        "maroon":"#7D0A0A",
        "redish":"#BF3131"
      }
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
}

