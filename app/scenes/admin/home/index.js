const path = require('path')
const { Scenes, Markup } = require('telegraf')
const { Models, BotSettigs } = require('../../../database')
const { Functions } = require('../../../tools')
const { getText } = Functions
const { BaseScene } = Scenes
const { Users } = Models

const callbacks = {
    partnerChannel: 'admin.home.partnerChannel',
    stat: 'admin.home.stat',
    getDB: 'admin.home.getDB',
    publishAd: 'admin.home.publishAd',
}

async function makeInlineKeyboard(ctx, lang){
    let buttons = []

    buttons.push([ Markup.button.callback(getText(lang, callbacks.partnerChannel), callbacks.partnerChannel) ])
    buttons.push([ Markup.button.callback(getText(lang, callbacks.stat), callbacks.stat) ])
    
    if(BotSettigs.isOwner(ctx.from.id)){
        buttons.push([ Markup.button.callback(getText(lang, callbacks.getDB), callbacks.getDB) ])
    }
    
    buttons.push([ Markup.button.callback(getText(lang, callbacks.publishAd), callbacks.publishAd) ])

    return Markup.inlineKeyboard(buttons)
}

const scene = new BaseScene('admin-home')

scene.enter( async ctx => {
    const LANG = ctx.session.LANG
    const caption = Functions.getText(LANG, 'admin.home.header')
    const keyboard = await makeInlineKeyboard(ctx, LANG)

    Functions.sendSceneMessageSafely(ctx, caption, keyboard)
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callbacks.partnerChannel: {
            ctx.scene.enter('admin-partnerChannel')
            break;
        }
        case callbacks.stat: {
            await ctx.deleteMessage()
            ctx.session.currentSceneMsg = null
            const userCount = await Users.count()
            const stoppers = BotSettigs.getStopCount()
            const actives = userCount - stoppers

            await ctx.replyWithHTML(`<b>📊 Statistika</b>\n\n<b>👤 Umumiy foydalanuvchilar: </b>${userCount}\n<b>❤️‍🔥 Aktiv: </b>${actives}\n<b>⚠️ Stop bosganlar: </b>${stoppers}`)

            await ctx.scene.reenter()
            break;
        }
        case callbacks.getDB: {
            await ctx.deleteMessage()
            ctx.session.currentSceneMsg = null
            const path1 = await Functions.makeExcel( await Users.all() )
            const filePaths = [ path1 ] //Models.mergedArchiveFilePaths()

            if(filePaths.length > 0){
                for(let i=0; i < filePaths.length; i++){
                    ctx.telegram.sendDocument(ctx.from.id, { source: filePaths[i] })
                    .catch( err => {})
                }
            } else {
                await ctx.reply(getText(ctx.session.LANG, 'admin.home.empty_db'))
            }
            
            ctx.scene.reenter()

            break;
        }
        case callbacks.publishAd: {
            ctx.scene.enter('admin-publish_ad')
        }
    }
})

scene.on('message', async ctx => {
    const cmd = ctx.message.text;
		
    switch(cmd){
        case '/start': {
            require('../../../actions/commands/start').action(ctx)
            break;
        }
        case '/admin': {
            require('../../../actions/commands/admin').action(ctx)
            break;
        }
        case '/help': {
            require('../../../actions/commands/help').action(ctx)
            break;
        }
        case '/setadmin': {
            require('../../../actions/commands/setadmin').action(ctx)
            break;
        }
        case '/unsetadmin': {
            require('../../../actions/commands/unsetadmin').action(ctx)
            break;
        }
        case '/getadmins': {
            require('../../../actions/commands/getadmins').action(ctx)
            break;
        }
        case '/getid': {
            require('../../../actions/commands/getid').action(ctx)
            break;
        }
    }
})

module.exports = [
    scene,
    require('./partnerChannel'),
    require('./publish_ad')
]