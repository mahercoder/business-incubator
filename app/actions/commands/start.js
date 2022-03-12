const { Models, BotSettigs } = require('../../database')
const { Users } = Models

module.exports = {
    name: `start`,
    action: async function(ctx){
        ctx.session.LANG = 'uz'
        
        Users.set({
            ...ctx.from
        })

        const isSubscribed = await BotSettigs.isSubscribed(ctx)
    
        if(isSubscribed){
            ctx.scene.enter('user-home')
        } else {
            ctx.scene.enter('subscription')
        }

        // ctx.scene.enter('user-home')

        // Users.get(ctx.from.id)
        // .then( async user => {
        //     if(user){
        //         ctx.session.LANG = 'uz'

        //         if(BotSettigs.isOwner(ctx.from.id) || BotSettigs.isAdmin(ctx.from.id)){
        //             ctx.scene.enter('user-home')
        //         } else {
        //             const isSubscribed = await BotSettigs.isSubscribed(ctx)
    
        //             if(isSubscribed){
        //                 ctx.scene.enter('user-home')
        //             } else {
        //                 ctx.scene.enter('subscription')
        //             }
        //         }
        //     } else {
        //         ctx.session.LANG = 'uz'
        //         ctx.scene.enter('signup')   
        //     }
        // })
    }
}