/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['var(--font-nunito)', 'sans-serif'],
      },
      colors: {
        primary: '#3d4753',
        secondary: '#111820',
        accent: '#facc16',
      },
      backgroundColor: {
        'primary-transparent': 'rgba(61, 71, 83, 0.95)',
        'secondary-transparent': 'rgba(17, 24, 32, 0.95)',
      },
    },
  },
  plugins: [
    import('@tailwindcss/typography'),
  ],
}