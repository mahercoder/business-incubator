const fs = require('fs')
const { Models } = require('../..')
const { Parent } = Models
const { parentPort, workerData } = require('worker_threads')
// const beautify = require('js-beautify').js;

function matrixify(arr, dimen){
     let matrix = [], i, k;
 
     for(i=0, k=-1; i < arr.length; i++){
         if(i % dimen === 0){
             k++;
             matrix[k] = [];
         }
         matrix[k].push(arr[i]);
     }
 
     return matrix;
}

(async () => {
    const modelName = workerData.modelName
    const Model = Parent.getInstance(modelName)
    const backupPath = Model.getBackupPath()
    
    const datas = matrixify(await Model.all(), 5000)
    
    for(let i=0; i < datas.length; i++){
        const data = datas[i]
        const filePath = `${backupPath}/${i}.json`

        const text = JSON.stringify(data)
        // beautify(JSON.stringify(data), { 
        //     indent_size: 2, 
        //     space_in_empty_paren: true, 
        //     indent_with_tabs: true, 
        //     end_with_newline: true
        // })
    
        fs.writeFileSync(filePath, text, 'utf-8', async (err) => {
            if(err) console.log(err)
        })
    }

    parentPort.postMessage({ msg: 'Done!' });
})();