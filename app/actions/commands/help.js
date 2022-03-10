const { BotSettigs } = require('../../database')

module.exports = {
    name: `help`,
    action: // undefined
    async function(ctx){
          if(BotSettigs.isOwner(ctx.from.id) || BotSettigs.isAdmin(ctx.from.id)){
               let result = `<b>Bot otasi uchun buyruqlar to'plami!</b>\n\n`;
               result += `<b>/setadmin - user_id</b> | yangi admin saylash!\n`
               result += `<b>/unsetadmin - user_id</b> | adminlikdan chiqarish!\n`
               result += `<b>/getadmins</b> | adminlar ro'yxatini olish!\n\n`
               result += `<b>/admin</b> | Admin panelni ochish!\n\n`

               ctx.replyWithHTML(result)
          }
    }
}