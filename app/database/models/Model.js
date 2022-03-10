const fs = require('fs')
const path = require('path')
const archiver = require('archiver')
const { ArchiveService, BackupService, CacheService } = require('../services')

/* helper functions */
function zip(source, out) {
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

// Template class
// Using Model you can easily control your data tables with synchronization of file and cache!
class Model {
     /* Barcha instance'lar kolleksiyasi */
     static #instances = [];

     /* Barcha child-class instance`larni olish */
     static getInstances(){ return Model.#instances }

     /* Berilgan nomdagi child-class instance`ini olish */
     static getInstance(name){
          for(let i=0; i < Model.#instances.length; i++){
               if(name == Model.#instances[i].name){
                    return Model.#instances[i]
               }
          }
     }

     /* Har bir sub-class fayllarini tartiblab cache`ga yozish */
     static async cacherize(){
          for(let i=0; i < Model.#instances.length; i++){
               CacheService.run(Model.#instances[i].name)
          }
     }

     /* Har bir child-class ma'lumotlarini fayllarga taqsimlab yozish */
     static async backup(){
          for(let i=0; i < Model.#instances.length; i++){
               BackupService.run(Model.#instances[i].name)
          }
     }

     /* Har bir child-class fayllarini arxivlash */
     static async archivize(){
          for(let i=0; i < Model.#instances.length; i++){
               ArchiveService.run(Model.#instances[i].name)
          }
     }


     /* Har bir child-class arxivlarini yaxlit bitta arxivga yig'ish */
     static async mergeArchives(){
          for(let i=0; i < Model.#instances.length; i++){
               const modelInstance = Model.#instances[i];
               const archivePath = modelInstance.getArchivePath()
               const mergedPath = path.join(`${modelInstance.getArchivePath()}`, '..', `${modelInstance.name}.rar`)
               await zip(archivePath, mergedPath)
          }
     }

     constructor(name){
          this.name = name;
          Model.#instances.push(this);
     }

     // @override | MUST HAVE!
     getBackupPath(){
          if (this.getBackupPath === Model.prototype.getBackupPath) {
               throw new TypeError("You must override method getBackupPath()");
          }
     }

     // @override | MUST HAVE!
     getArchivePath(){
          if (this.getArchivePath === Model.prototype.getArchivePath) {
               throw new TypeError("You must override method getArchivePath()");
          }
     }
 
     // @override | MUST HAVE!
     async set(){
          if (this.set === Model.prototype.set) {
               throw new TypeError("You must override method set()");
          }
     }

     // @override | MUST HAVE!
     async all(){
          if (this.getAll === Model.prototype.getAll) {
               throw new TypeError("You must override method all()");
          }
     }

     /* subclass`ni to'laligicha o'chirish */
     destroy(){
          let i = Model.#instances.indexOf(this);
          Model.#instances.splice(i, 1);
     }
}

module.exports = Model