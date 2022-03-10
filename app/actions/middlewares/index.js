const report = require('./report')
const stage = require('./stage') 
const session  = require('./session')

module.exports = async bot => {

    bot.use(session)
    bot.use(stage)
    bot.catch(report)
    
}