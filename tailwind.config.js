// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)', // Or use (0.25, 0.1, 0.25, 1) for easeOutQuad
      },
      keyframes: {
        blinking: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        typing: {
          from: { width: '0' },
          to: { width: '100%' },
        },
      },
      animation: {
        blinking: 'blinking 1s steps(1, end) infinite',
        typing: 'typing 4s steps(40, end)',
        'typing-blink': 'blinking 1s steps(1, end) infinite, typing 4s steps(40, end)',
      },

      fontFamily: {
        'main-family': ["Spline Sans", 'sans-serif']
      },
    },
  },
  plugins: [],
};
