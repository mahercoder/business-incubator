const fs = require('fs')
const path = require('path')
const User = require('./User')

const rootDataPath = path.join(__dirname, '..', '/data');
const rootBackupPath = `${rootDataPath}/backup`;
const rootArchivePath = `${rootDataPath}/archive`;

if(!fs.existsSync(rootDataPath)) fs.mkdirSync(rootDataPath);
if(!fs.existsSync(rootBackupPath)) fs.mkdirSync(rootBackupPath);
if(!fs.existsSync(rootArchivePath)) fs.mkdirSync(rootArchivePath);

const Users = new User(rootBackupPath, rootArchivePath)

// Yaxlitlangan arxivlar path`larini bitta massivga yig'ish
function mergedArchiveFilePaths(){
     let all = []

     fs.readdirSync(rootArchivePath)
     .filter(file => {
          return file.slice(-4) === '.rar'
     })
     .forEach(file => {
          all.push(`${rootArchivePath}/${file}`)
     })

     return all;
}

module.exports = {
     Users,
     mergedArchiveFilePaths
}