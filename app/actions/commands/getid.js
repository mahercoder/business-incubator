module.exports = {
     name: `getid`,
     action: async function(ctx){
         ctx.reply(ctx.from.id)
     }
 }