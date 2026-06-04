/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        paper: "#F2F2EE",
        limestone: "#E5DDC6",
        ink: "#484848",
        olive: "#215732",
        "olive-dark": "#13322B",
        tobacco: "#6A5B45",
        copper: "#CF8148",
        rust: "#BA0C2F",
        tan: "#E6DDC9",
        rule: "#D7D2CB",
        muted: "#64615C",
        ivory: "#FFFFFF"
      },
      fontFamily: {
        display: ['"Neutraface"', '"Avenir Next"', '"Helvetica Neue"', "Arial", "sans-serif"],
        serif: ['"freight-text-pro"', "Georgia", '"Times New Roman"', "serif"]
      },
      boxShadow: {
        print: "0 18px 45px rgba(28, 28, 26, 0.10)"
      }
    }
  },
  plugins: []
};
