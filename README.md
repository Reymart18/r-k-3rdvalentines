npm create vite@latest
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p

@tailwind base;
@tailwind components;
@tailwind utilities;

config

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

tools para sa real 3d using webGL
npm install three @react-three/fiber @react-three/drei