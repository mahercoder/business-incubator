const { Scenes, Markup } = require('telegraf')
const { BaseScene } = Scenes
const { Functions } = require('../../../tools')


const scene = new BaseScene('projectname')

scene.enter( async ctx => {
     const LANG = ctx.session.LANG
     const caption = Functions.getText(LANG, 'user.signup.projectname.header')

     // if(ctx.session.currentSceneMsg){
     //      ctx.deleteMessage(ctx.session.currentSceneMsg.message_id)
     //      .catch( err => {})
     // }

     ctx.replyWithHTML(caption, null)
     .then( msg => ctx.session.currentSceneMsg = msg)
})

scene.on('text', async ctx => {
     if(ctx.message.entities && ctx.message.entities[0].type == 'bot_command' ){
          ctx.session.signup_user = null
          require(`../../../actions/commands${ctx.message.text}`)
          .action(ctx)
          .catch( err => {})
     } else {
          ctx.session.signup_user.projectname = ctx.message.text
     
          // ctx.deleteMessage()
          // if(ctx.session.currentSceneMsg){
          //      ctx.deleteMessage(ctx.session.currentSceneMsg.message_id)
          //      .catch( err => {})
          // }
     
          ctx.scene.enter('workplace')
     }
})

scene.command('start', async ctx => require('../../../actions/commands/start').action(ctx))

scene.on('message', ctx => {
     ctx.deleteMessage()
})

module.exports = scene