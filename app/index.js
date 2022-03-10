const { Telegraf } = require('telegraf')
const { Constants } = require('./tools')
const { middlewares, commands, updates, startup } = require('./actions')

// const TOKEN = `5021272526:AAHDOwFxI4N0Sl3V8gOg-FutyZmKKhsh0vw`
const TOKEN = `5111219626:AAE1p8p0kh1wFccJq-Tmf0b9VVLUVx3ktkc`
// 5174234463
// const TOKEN = Constants.TEST_TOKEN
const bot = new Telegraf(TOKEN)

// Init...
middlewares(bot)
commands(bot)
updates(bot)

// Start...
startup(bot)
