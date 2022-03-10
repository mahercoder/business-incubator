const { Models, BotSettigs } = require('../../database')
const { Users } = Models

module.exports = {
    name: `start`,
    action: async function(ctx){
        ctx.session.LANG = 'uz'
        
        Users.set({
            ...ctx.from
        })

        ctx.scene.enter('user-home')

        // Users.get(ctx.from.id)
        // .then( async user => {
        //     if(user){
        //         ctx.session.LANG = user.language

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
        //         // Kimdir referal orqali ro'yxatdan o'tayotgan bo'lsa, 
        //         // referal id olinadi
        //         const referalId = ctx.message.text ? ctx.message.text.split(' ')[1] : undefined
        //         if(referalId){
        //             Users.get(referalId)
        //             .then( async user => {
        //                 if(user){ ctx.session.referalId = referalId }
        //             })
        //         }
                
        //         ctx.scene.enter('signup')
                
        //     }
        // })
    }
}