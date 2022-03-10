const path = require('path')
const { Scenes, Markup } = require('telegraf')
const { BaseScene } = Scenes
const { BotSettigs } = require('../../../database')
const { Functions } = require('../../../tools')

const callbacks = {
     yes: 'user.signup.agreement.yes',
     no:  'user.signup.agreement.no'
}
 
async function makeInlineKeyboard(ctx, lang){
     let buttons = []
 
     buttons.push([ 
          Markup.button.callback(Functions.getText(lang, callbacks.no), callbacks.no), 
          Markup.button.callback(Functions.getText(lang, callbacks.yes), callbacks.yes)
     ])
 
     return Markup.inlineKeyboard(buttons)
}

const scene = new BaseScene('getfile')

scene.enter( async ctx => {
     const LANG = ctx.session.LANG
     const caption = Functions.getText(LANG, 'user.signup.getfile.header')

     // if(ctx.session.currentSceneMsg){
     //      ctx.deleteMessage(ctx.session.currentSceneMsg.message_id)
     //      .catch( err => {})
     // }

     ctx.replyWithDocument({ source: path.join(__dirname, "..", "..", "..", "/database/constants/namuna.docx") }, {
          caption: caption
     })
     .then( msg => ctx.session.currentSceneMsg = msg)
})

scene.on('document', async ctx => {
     const { file_id } = ctx.message.document;
     
     let caption = ''
     
     caption += `<b>${Functions.getText(ctx.session.LANG, 'user.signup.fname.title')}</b> ${ctx.session.signup_user.fname}\n`
     caption += `<b>${Functions.getText(ctx.session.LANG, 'user.signup.projectname.title')}</b> ${ctx.session.signup_user.projectname}\n`
     caption += `<b>${Functions.getText(ctx.session.LANG, 'user.signup.workplace.title')}</b> ${ctx.session.signup_user.workplace}\n\n`

     // caption += `${Functions.getText(ctx.session.LANG, 'user.signup.agreement.header')}`

     const keyboard = await makeInlineKeyboard(ctx, ctx.session.LANG)

     ctx.replyWithDocument(file_id, {
          caption: caption,
          parse_mode: 'HTML',
          ...keyboard
     })
     .then( msg => ctx.session.saved_msg = msg)
     .catch(err => {})
})

scene.on('text', async ctx => {
     if(ctx.message.entities && ctx.message.entities[0].type == 'bot_command' ){
          ctx.session.signup_user = null
          require(`../../../actions/commands${ctx.message.text}`)
          .action(ctx)
          .catch( err => {})
     }
})

scene.action(/.+/, async ctx => {
     const action = ctx.callbackQuery.data
     switch(action){
          case callbacks.no: {
               // ctx.deleteMessage()
               ctx.replyWithHTML(Functions.getText(ctx.session.LANG, 'user.signup.agreement.cancelled'))
               ctx.scene.leave()
               break;
          }
          case callbacks.yes: {
               const admins = [ ...BotSettigs.getAdminIds(), ...BotSettigs.getOwners() ]

               for(let i=0; i < admins.length; i++){
                    const adminId = admins[i]
                    ctx.copyMessage(adminId)
               }

               ctx.editMessageReplyMarkup(null)
               ctx.replyWithHTML(Functions.getText(ctx.session.LANG, 'user.signup.agreement.sent'))

               ctx.scene.leave()
          }
     }
})

scene.command('start', async ctx => require('../../../actions/commands/start').action(ctx))

scene.on('message', ctx => {
     ctx.deleteMessage()
})

module.exports = scene