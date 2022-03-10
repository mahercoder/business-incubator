const { Scenes, Markup } = require('telegraf')
const { BotSettigs, Models } = require('../../../database')
const { Functions } = require('../../../tools')
const { Users } = Models
const { BaseScene } = Scenes
const { getText } = Functions

const callbacks = {
    yes: 'admin.publish_ad.yes',
    no: 'admin.publish_ad.no',
    back: 'admin.publish_ad.back'
}

async function makeInlineKeyboard(lang){
    let buttons = []

    buttons.push([ Markup.button.callback(getText(lang, callbacks.back), callbacks.back) ])

    return Markup.inlineKeyboard(buttons)
}

async function makeVerificationInlineKeyboard(lang){
    let buttons = []

    buttons.push([ 
        Markup.button.callback(getText(lang, callbacks.yes), callbacks.yes),
        Markup.button.callback(getText(lang, callbacks.no), callbacks.no)
    ])

    return Markup.inlineKeyboard(buttons)
}

const scene = new BaseScene('admin-publish_ad')

scene.enter( async ctx => {
    const LANG = ctx.session.LANG
    const caption = getText(LANG, 'admin.publish_ad.header')
    const keyboard = await makeInlineKeyboard(LANG)

    if(ctx.session.currentSceneMsg){
        try{        
            ctx.editMessageText(caption, { parse_mode: 'HTML', ...keyboard })
        } catch(err) {
            ctx.replyWithHTML(caption)
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
        case callbacks.yes: {

            await ctx.deleteMessage(ctx.session.currentSceneMsg.message_id)
            ctx.session.currentSceneMsg = null

            Users
            .all()
            .then( async users => {
                let report = ``
                let receiverCount = 0
                let stopperCount = 0

                ctx.session.currentSceneMsg = await ctx.replyWithHTML(getText(ctx.session.LANG, 'admin.publish_ad.loading'))
                
                for(let i=0; i < users.length; i++){
                    try{

                        if(users[i].id != ctx.from.id){
                            await ctx.telegram.copyMessage(
                                users[i].id, 
                                ctx.from.id, 
                                ctx.session.adMsgAgreement.message_id
                            )

                            // ctx.telegram.sendMessage(users[i].id, 'Rahmat!')
                            // .then( async msg => {
                            //     ctx.telegram.deleteMessage(msg.chat.id, msg.message_id)
                            //     .catch(err => {})

                            //     Users.get(users[i].id)
                            //     .then( async user => {
                            //         if(!user.lastAdsMessagIds){
                            //             user.lastAdsMessagIds = []
                            //             user.lastAdsMessagIds.push(msg.message_id-1)
                            //             Users.set(user)
                            //         }
                            //     })
                            // })
                        }

                        receiverCount++
                    }catch(err){
                        // Forbidden: bot was blocked by the user
                        // if(err.error_code == 403){
                        //     stopperCount++ 
                        // }
                    }
                }
                
                stopperCount = users.length - receiverCount;
                report = `<b>📊 Reklama statistikasi</b>\n\n<b>👤 Umumiy foydalanuvchilar: </b>${users.length}\n<b>❤️‍🔥 Reklama qabul qilganlar: </b>${receiverCount}\n<b>⚠️ Stop bosganlar: </b>${stopperCount}`
                BotSettigs.setStopCount(stopperCount)
        
                await ctx.deleteMessage(ctx.session.currentSceneMsg.message_id)
                ctx.session.currentSceneMsg = null

                await ctx.replyWithHTML(report)
                await ctx.scene.enter('admin-home')
            })

            break;
        }
        case callbacks.no: {
            await ctx.deleteMessage(ctx.session.adMsgAgreement.message_id)
            ctx.session.adMsgAgreement = null
            ctx.scene.reenter()
            break;
        }
        case callbacks.back: {

            if(ctx.session.adMsgAgreement){
                await ctx.deleteMessage(ctx.session.adMsgAgreement.message_id)
            }

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
            
            try{
                const LANG = ctx.session.LANG
                ctx.session.adMsg = ctx.message;
                const caption = getText(LANG, 'admin.publish_ad.agreement')
                const keyboard = await makeVerificationInlineKeyboard(LANG)
                
                await ctx.deleteMessage(ctx.session.currentSceneMsg.message_id)
                ctx.session.currentSceneMsg = null;
                
                ctx.session.adMsgAgreement = await ctx.telegram.copyMessage(ctx.chat.id, ctx.from.id, ctx.session.adMsg.message_id)
                await ctx.deleteMessage(ctx.session.adMsg.message_id)                

                // Verification Form!
                ctx.session.currentSceneMsg = await ctx.replyWithHTML(caption, keyboard)
            } catch(err) {
                await ctx.reply(getText(ctx.session.LANG, 'admin.publish_ad.rejected'))
                await ctx.scene.reenter()
            }
        }
    }
})

module.exports = scene