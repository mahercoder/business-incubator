module.exports = {
     Constants: require('./constants'),
     Models: {
          ...require('./models'),
          Parent: require('./models/Model')
     },

     BotSettigs: require('./config'),
     Locales: require('./locales')
}