module.exports = {
  "plugins": {
    "autoprefixer": {
      "browsers": [
        "ie >= 9",
        "ff >= 30",
        "chrome >= 34",
        "safari >= 7",
        "opera >= 23"
      ]
    },
    "postcss-px2rem-exclude": {
      remUnit: 100,
      exclude: /mint-ui/i
    }
  }
}