const themeColors = require('./colors');

module.exports = {
    theme: {
        extend: {
            screens: {
                'sm': '640px',
                'md': '768px',
                'lg': '1024px',
                'xl': '1280px',
                '2xl': '1536px'
            },
            fontFamily: {
                heading: ["Montserrat", "Tahoma", "sans-serif"]
            },
            colors: themeColors,
            backgroundColor: themeColors
        }
    },
    content: [
        "../../../*.html",
        "../../../zpages/*.html",
        "../../../src/components/**/*.js"
    ],
    plugins: [],
}