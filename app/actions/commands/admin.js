const { Models, BotSettigs } = require('../../database')
const { Users } = Models

module.exports = {
    name: `admin`,
    action: async function(ctx){
          ctx.session.LANG = 'uz'
          
          if(BotSettigs.isOwner(ctx.from.id) || BotSettigs.isAdmin(ctx.from.id)){
               ctx.scene.enter('admin-home')
          }
          
          // Users.get(ctx.from.id)
          // .then( async user => {
          //      if(user){
          //           console.log('YES')

          //      }
          // })
     }
}