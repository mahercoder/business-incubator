const { BotSettigs } = require('../../database')

module.exports = {
	name: 'getadmins',
	action: async function(ctx) {
        if(BotSettigs.isOwner(ctx.from.id)){
            ctx.replyWithHTML(
               await BotSettigs.getAdmins(ctx)
            )
        }
	}
}