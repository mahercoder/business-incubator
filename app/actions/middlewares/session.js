const { BotSettigs } = require('../../database')
const LocalSession = require('telegraf-session-local')
const Session = new LocalSession({ storage: LocalSession.storageFileAsync, database: `${BotSettigs.getTempPath()}/session.json` })

module.exports = Session.middleware()

// const RedisSession = require('telegraf-session-redis')

// const RedisSession = require('./RedisSession');
// const session = new RedisSession({
//      store: {
//           host: process.env.TELEGRAM_SESSION_HOST || '127.0.0.1',
//           port: process.env.TELEGRAM_SESSION_PORT || 6379
//      }
// })

// module.exports = session;