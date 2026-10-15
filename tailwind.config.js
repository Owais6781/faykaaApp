/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./globaltheme/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
   darkMode: "class",
  theme: {
    extend: {

 fontFamily: {
        display: ["CormorantMedium"],
        "display-semibold": ["CormorantSemiBold"],
        "display-italic": ["CormorantItalic"],

        ui: ["InterRegular"],
        "ui-medium": ["InterMedium"],
        "ui-semibold": ["InterSemiBold"],
        "ui-bold": ["InterBold"],
      },



      colors: {
        espresso: '#2B2420',
        cream: '#FBF7F0',
        creamBeige: "#F5E8C8",
        lightRose: "#FECACA",
        brass: '#B08D57',
        'Vintage-Gray':"#B3AB97",
        'warm-gray ': '#8C8377',
        'Warm-Brass':"#D9C08F",
        bgcard:"#EFEAE0",
        bgcream: "#F8F5EF",
        textcream: "#F8F5EF",
        goldtext:"#A9803F",
        
       softGold: "#FFD56A",
        textcolor:"#E2D9C4",
        graytext:"#7A7365",
        blacktext:"#1E1B16",
        bgbrown:"#7B2D26",
        Couponstext:"#E84C7F",
         lightgoldtext:"#9A9282",
        descriptiongraytext:"#9A9282",
        graytextcolor:"#B3AB97",
        Hearticone:"#3A362F",
        Carticone:"#3A362F",
      },
    },
  },
  plugins: [],
}