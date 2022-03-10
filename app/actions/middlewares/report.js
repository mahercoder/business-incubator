const { Logger } = require('../../tools')

module.exports = err => {
    Logger.saveError(`GLOBAL ERROR: ` + err)
}