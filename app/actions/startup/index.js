const cron = require('node-cron')
const { Models } = require('../../database')
const { Parent } = Models

async function onStart(bot){
     
     // Barcha faylga yozilgan ma'lumotlarni keshga yuklash
     await Parent.cacherize()

     // Har bir minutda quyidagi callback ishga tushadi!
     cron.schedule('* * * * *', async () => {
          const currentMinute = (new Date()).getMinutes()
          
          // Har 9 minutda keshdagi ma'lumotlarni faylga yozish
          if(currentMinute % 9 == 0 && currentMinute != 0){
               Parent.backup()
          }

          // Har 14 daqiqada barcha fayllarni arxivlash
          if(currentMinute % 14 == 0 && currentMinute != 0){
               Parent.archivize()
          }

          // Har 19 daqiqada arxivlarni birlashtirish
          if(currentMinute % 19 == 0 && currentMinute != 0){
               Parent.mergeArchives()
          }
     })

     // Botni ishga tushirish...
     bot.launch().then( async () => {
          console.info('Test-Bot is up and running...')
     })
}

module.exports = onStart