// const axios = require('axios')

module.exports = {
     name: `photo`,
     action: undefined
     // async function(ctx){
     //      let file_id, fileSize = 0
     //      let photos = ctx.message.photo

     //      for(let i=0; i < photos.length; i++){
     //           const img = photos[i]
     //           if(fileSize < img.file_size){
     //                fileSize = img.file_size
     //                file_id = img.file_id
     //           }
     //      }
          
     //      ctx.telegram.getFileLink(file_id)
     //      .then( async fileLink => {
               
     //           console.log(fileLink.href)

     //           axios.post('http://127.0.0.1:3000/', {
     //                file_id: file_id,
     //                url: fileLink.href
     //           })
     //           .then(function (response) {
     //                console.log(response.data);
     //           })
     //           .catch(function (error) {
     //                console.log(error);
     //           });
     //      })

     //      // const dirName = `${usrTempPath}/${file_name}`
     //      // const writer = fs.createWriteStream(dirName)

     //      //     axios({
     //      //         method: 'get', url: fileLink.href, responseType: 'stream'
     //      //     }).then( async response => {
     //      //         response.data.pipe(writer)
     //      //         writer.on('finish', callback)
     //      //     })
          
     //      // axios.post('localhost:3000/', {
     //      //      file_id: file_id,
     //      //      url: fileLink.href
     //      // })
     //      // .then(function (response) {
     //      //      console.log(response);
     //      // })
     //      // .catch(function (error) {
     //      //      console.log(error);
     //      // });
     // }
 }