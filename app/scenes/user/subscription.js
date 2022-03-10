const { Scenes, Markup } = require('telegraf')
const { BaseScene } = Scenes
const { BotSettigs } = require('../../database')
const { Functions } = require('../../tools')

const callbacks = {
    done: 'user.subscription.agree'
}

async function makeInlineKeyboard(ctx, lang){
    let buttons = []
    const partnerChannels = BotSettigs.getPartnerChannels()

    for(let i=0; i < partnerChannels.length; i++){
          try{
               if( !(await BotSettigs.isSubscribed(ctx, partnerChannels[i])) ){
                    
                    const channel = await ctx.telegram.getChat(partnerChannels[i])
                    const url = channel.username ? `https://t.me/${channel.username}` : channel.invite_link

                    buttons.push([ Markup.button.url(channel.title, url) ])
               }
          } catch(err){
                    if(err.code == 403){
                    BotSettigs.removePartnerChannel(i)
                    }
          }
    }

    buttons.push([ Markup.button.callback(Functions.getText(lang, callbacks.done), callbacks.done) ])

    return Markup.inlineKeyboard(buttons)
}

const scene = new BaseScene('subscription')

scene.enter( async ctx => {
    const LANG = ctx.session.LANG
    const caption = Functions.getText(LANG, 'user.subscription.header')
    const keyboard = await makeInlineKeyboard(ctx, LANG)

    Functions.sendSceneMessageSafely(ctx, caption, keyboard)
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callbacks.done: {
          const isSubscribed = await BotSettigs.isSubscribed(ctx)

          if(isSubscribed){
               ctx.scene.enter('user-home')
          } else {
               ctx.deleteMessage()
               ctx.scene.reenter()
          }

          break
        }
    }
})

scene.command('start', async ctx => {
     ctx.deleteMessage()
    require('../../actions/commands/start')
    .action(ctx)
})

scene.on('message', async ctx => ctx.deleteMessage())

module.exports = scene