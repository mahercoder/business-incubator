const fs = require('fs')
const { Models } = require('../..')
const { Parent } = Models
const { parentPort, workerData } = require('worker_threads');

(async () => {
    const modelName = workerData.modelName
    const Model = Parent.getInstance(modelName)
    const backupPath = Model.getBackupPath()
    let iterator = 0

    while(fs.existsSync(`${backupPath}/${iterator}.json`)){
        const data = require(`${backupPath}/${iterator}.json`)

        for(let i=0; i < data.length; i++){
            const item = data[i]
            Model.set(item)
        }

        iterator += 1
    }

    parentPort.postMessage({ msg: 'Done!' })
})()