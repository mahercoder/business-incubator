const fs = require('fs')
const { Models } = require('../..')
const { Parent } = Models
const { parentPort, workerData } = require('worker_threads');
const archiver = require('archiver');

function zipDirectory(source, out) {
  const archive = archiver('zip', { zlib: { level: 9 }});
    const stream = fs.createWriteStream(out);
  
    return new Promise((resolve, reject) => {
      archive
        .directory(source, false)
        .on('error', err => reject(err))
        .pipe(stream)
      ;
  
      stream.on('close', () => resolve());
      archive.finalize();
    });
}

(async () => {
    const modelName = workerData.modelName
    const Model = Parent.getInstance(modelName)
    const backupPath = Model.getBackupPath()
    const archivePath = Model.getArchivePath()

    const day = (new Date()).getDate() < 10 ? `0${(new Date()).getDate()}` : (new Date()).getDate()
    const month = (new Date()).getMonth() < 10 ? `0${(new Date()).getMonth()}` : (new Date()).getMonth()
    const year = (new Date()).getFullYear()

    const date = `${day}.${month}.${year}`
    const newArchivePath = `${archivePath}/${date}.rar`

    await zipDirectory(backupPath, newArchivePath)

    parentPort.postMessage({ msg: 'Done!' });
})();