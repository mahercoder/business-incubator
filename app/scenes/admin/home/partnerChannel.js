const { Scenes, Markup } = require('telegraf')
const { BotSettigs } = require('../../../database')
const { Functions } = require('../../../tools')
const { BaseScene } = Scenes
const { getText } = Functions

const callbacks = {
    del: 'admin.partner_channel.del',
    back: 'admin.partner_channel.back'
}

async function makeInlineKeyboard(ctx, lang){
    let buttons = []

    const partnerChannels = BotSettigs.getPartnerChannels()

    for(let i=0; i < partnerChannels.length; i++){
        try{
            const channel = await ctx.telegram.getChat(partnerChannels[i])
            const url = channel.username ? `https://t.me/${channel.username}` : channel.invite_link

            buttons.push([
                Markup.button.url(channel.title, url),
                Markup.button.callback(getText(lang, callbacks.del), `${callbacks.del}--${i}`)
            ])

        } catch(err){
            if(err.code == 403){
                BotSettigs.removePartnerChannel(i)
            }
        }
    }

    buttons.push([ Markup.button.callback(
        getText(lang, callbacks.back), callbacks.back) 
    ])

    return Markup.inlineKeyboard(buttons)
}

const scene = new BaseScene('admin-partnerChannel')

scene.enter( async ctx => {
    const caption = getText(ctx.session.LANG, 'admin.partner_channel.header')
    const keyboard = await makeInlineKeyboard(ctx, ctx.session.LANG)

    if(ctx.session.currentSceneMsg){
        try{        
            ctx.editMessageText(caption, { parse_mode: 'HTML', ...keyboard })
        } catch(err) {
            ctx.replyWithHTML(caption, keyboard)
            .then( msg => ctx.session.currentSceneMsg = msg)
        }
    } else {
        ctx.replyWithHTML(caption, keyboard)
        .then( msg => ctx.session.currentSceneMsg = msg)
    }
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data.split('--')[0]
    switch(action){
        case callbacks.del: {
            const index = ctx.callbackQuery.data.split('--')[1]
            
            const channel = await ctx.telegram.getChat(BotSettigs.getPartnerChannels()[index])
            const url = channel.username ? `https://t.me/${channel.username}` : channel.invite_link
            
            BotSettigs.removePartnerChannel(index)
            await ctx.deleteMessage(ctx.session.currentSceneMsg.message_id)
            ctx.session.currentSceneMsg = null
            await ctx.replyWithHTML(
                getText(ctx.session.LANG, 'admin.partner_channel.rejected_contract')
                + `<a href="${url}">${channel.title}</a>`,
                { disable_web_page_preview: true }
            )
            ctx.scene.reenter()
            break;
        }
        case callbacks.back: {
            ctx.scene.enter('admin-home')
            break;
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
        default: {
            if(!ctx.message.forward_from_chat){
                await ctx.deleteMessage()
                await ctx.deleteMessage(ctx.session.currentSceneMsg.message_id)
                ctx.session.currentSceneMsg = null
                await ctx.reply(getText(ctx.session.LANG, 'admin.partner_channel.err_forward'))
                ctx.scene.reenter()
            }

            try{
                if(await BotSettigs.isBotAdminHere(ctx, ctx.message.forward_from_chat.id)){
                    BotSettigs.addPartnerChannel(ctx.message.forward_from_chat.id)
                    await ctx.deleteMessage()
                    await ctx.deleteMessage(ctx.session.currentSceneMsg.message_id)
                    ctx.session.currentSceneMsg = null
                    await ctx.reply(getText(ctx.session.LANG, 'admin.partner_channel.accepted'))
                    ctx.scene.reenter()
                } else {
                    await ctx.deleteMessage()
                    await ctx.reply(getText(ctx.session.LANG, 'admin.partner_channel.rejected'))
                }
            } catch(err){
                if(err){
                    await ctx.deleteMessage(ctx.session.currentSceneMsg.message_id)
                    ctx.session.currentSceneMsg = null
                    await ctx.reply(getText(ctx.session.LANG, 'admin.partner_channel.rejected'))
                    ctx.scene.reenter()
                }
            }
        }
    }
})

module.exports = scene