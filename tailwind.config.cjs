/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f4f6f8',
                    100: '#e4e8ef',
                    200: '#cbd4e1',
                    300: '#a4b5cb',
                    400: '#7791b0',
                    500: '#567598',
                    600: '#435c7c',
                    700: '#374b65',
                    800: '#2f4055',
                    900: '#2a3547',
                    950: '#1a2230',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                "fade-in-up": "fadeInUp 0.8s ease-out forwards",
                "blob": "blob 7s infinite",
            },
            keyframes: {
                fadeInUp: {
                    "0%": { opacity: 0, transform: "translateY(20px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                },
                blob: {
                    "0%": { transform: "translate(0px, 0px) scale(1)" },
                    "33%": { transform: "translate(30px, -50px) scale(1.1)" },
                    "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
                    "100%": { transform: "translate(0px, 0px) scale(1)" },
                }
            }
        },
    },
    plugins: [],
}
