const { Scenes } = require('telegraf')
const { BaseScene } = Scenes

const scene = new BaseScene('user-home')

scene.enter( async ctx => {
     ctx.scene.enter('signup')
})

scene.command('start', ctx => {
     // ctx.deleteMessage()
     require('../../../actions/commands/start').action(ctx)
})

scene.command('admin', ctx => {
     // ctx.deleteMessage()
     require('../../../actions/commands/admin').action(ctx)
})

scene.command('getadmins', ctx => {
     // ctx.deleteMessage()
     require('../../../actions/commands/getadmins').action(ctx)
})

scene.command('getid', ctx => {
     // ctx.deleteMessage()
     require('../../../actions/commands/getid').action(ctx)
})

scene.command('help', ctx => {
     // ctx.deleteMessage()
     require('../../../actions/commands/help').action(ctx)
})

scene.command('setadmin', ctx => {
     // ctx.deleteMessage()
     require('../../../actions/commands/setadmin').action(ctx)
})

scene.command('unsetadmin', ctx => {
     // ctx.deleteMessage()
     require('../../../actions/commands/unsetadmin').action(ctx)
})

scene.on('message', ctx => {
     ctx.deleteMessage()
})

module.exports = scene