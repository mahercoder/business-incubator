const { Worker } = require('worker_threads')

function run(modelName) {
     return new Promise((resolve, reject) => {
          const worker = new Worker(__dirname + '/service.js', { workerData: { modelName } })
          worker.on('message', () => {
               resolve()
               worker.terminate()
          })
          worker.on('error', reject)
          worker.on('exit', (code) => {
               if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
          })
     })
}

module.exports = { run }