const { BotSettigs } = require('../../database')

module.exports = {
	name: 'unsetadmin',
	action: async function(ctx) {
        if(BotSettigs.isOwner(ctx.from.id)){
            const adminId = (new Number(ctx.message.text.split('/unsetadmin ')[1])).valueOf()
            
            BotSettigs.removeAdmin(adminId)
            
            ctx.replyWithHTML(
                `Endi admin emas: <code>${adminId}</code>`
            )
        }
	}
}