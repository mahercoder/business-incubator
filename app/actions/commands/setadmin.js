const { BotSettigs } = require('../../database')

module.exports = {
	name: 'setadmin',
	action: async function(ctx) {
          if(BotSettigs.isOwner(ctx.from.id)){
               const newAdminId = (new Number(ctx.message.text.split('/setadmin ')[1])).valueOf()

               BotSettigs.setAdmin(newAdminId)

               ctx.replyWithHTML(
                    `Admin bo'ldi: <code>${newAdminId}</code>`
               )
          }
	}
}