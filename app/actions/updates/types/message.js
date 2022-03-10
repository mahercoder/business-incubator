const axios = require('axios')

module.exports = {
    name: `message`,
    action: undefined
    // async function(ctx){

        // console.log(ctx.message)
        // ctx.telegram.sendMessage(-1001796873193, 'Salomlar!')

    //   ctx.replyWithHTML(`1-savol<a href="https://mahercoder.fun/AgACAgIAAxkBAANVYe244r0ihuMnEEtGvKB86ad490gAAijAMRuQIGlLscjBWTtnaeYBAAMCAAN5AAMjBA.jpg">&#8205</a>`)

    //     let file_id, fileSize = 0
    //     let photos = ctx.message.photo

    //     for(let i=0; i < photos.length; i++){
    //          const img = photos[i]
    //          if(fileSize < img.file_size){
    //               fileSize = img.file_size
    //               file_id = img.file_id
    //          }
    //     }
        
    //     ctx.telegram.getFileLink(file_id)
    //     .then( async fileLink => {
    //          console.log(fileLink.href)
    //          axios.post('https://mahercoder.fun/', {
    //             file_id: file_id,
    //             url: fileLink.href
    //           })
    //           .then(function (response) {
    //                 console.log(response.data);
    //           })
    //           .catch(function (error) {
    //                 console.log(error);
    //           });
    //     })
            
//     }
}
