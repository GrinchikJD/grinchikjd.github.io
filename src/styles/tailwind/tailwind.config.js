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
            colors: themeColors,
            backgroundColor: themeColors
        }
    },
    content: [
        "../../../*.html",
        "../../../*.js",
        "../../../src/**/*.js"
    ],
    plugins: [],
}