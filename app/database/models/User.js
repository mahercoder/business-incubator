const fs = require('fs')
const Model = require('./Model')
const { promisify } = require('util')
const { Functions } = require('../../tools')
const Redis = require('redis').createClient()
const projectName = require('../../../package.json').name

Redis.on('error', err => console.log(err))

/*
     userObject: {
          id, 
          fullname,           // F.I.Sh
          projectName,        // Loyiha nomi
          workPlace          // Ish joyi
     }
*/

class User extends Model {
     static #className = 'Users';
     static #KEY = `${projectName}:USERS`; // `@projectName:USERS--id`
     static #backupPath;
     static #archivePath;

     constructor(rootBackupPath, rootArchivePath){
          super(User.#className);

          if(rootBackupPath && rootArchivePath){ 
               User.#backupPath = `${rootBackupPath}\\${User.#className}`;
               User.#archivePath = `${rootArchivePath}\\${User.#className}`;

               if(!fs.existsSync(User.#backupPath)) fs.mkdirSync(User.#backupPath);
               if(!fs.existsSync(User.#archivePath)) fs.mkdirSync(User.#archivePath);
          } else {
               throw new TypeError('You must give up both backup and archive root folders at the same time!');
          }
     }

     getBackupPath(){ return User.#backupPath }

     getArchivePath(){ return User.#archivePath}

     async set(userObject){
          const { id } = userObject
          const uniqKey = `${User.#KEY}--${id}`;
          Redis.set(uniqKey, JSON.stringify(userObject));
     }

     async get(id){
          const uniqKey = `${User.#KEY}--${id}`;
          const getAsync = promisify(Redis.get).bind(Redis)
          const user = await getAsync(uniqKey)
          return JSON.parse(user)
     }

     async getAllIds(){
          const ids = []
     
          const getAsync = promisify(Redis.get).bind(Redis)
          const getKeyAsync = promisify(Redis.KEYS).bind(Redis)
          const customKey = `${User.#KEY}--*`;
     
          const keys = await getKeyAsync(customKey)
          
          for(let i=0; i < keys.length; i++){
               const value = await getAsync(keys[i])
               const json = JSON.parse(value)
               ids.push(json.id)
          }
     
          return ids
     }

     async all(){
          const users = []
     
          const getAsync = promisify(Redis.get).bind(Redis)
          const getKeyAsync = promisify(Redis.KEYS).bind(Redis)
          const customKey = `${User.#KEY}--*`;
     
          const keys = await getKeyAsync(customKey)
          
          for(let i=0; i < keys.length; i++){
               const value = await getAsync(keys[i])
               users.push(JSON.parse(value))
          }
     
          return users
     }

     async count(){
          const getKeyAsync = promisify(Redis.KEYS).bind(Redis)
          const keys = await getKeyAsync(`${User.#KEY}--*`)
          return keys.length
     }

     async update(id, props){
          let oldUser = await this.getById(id)
          await this.del(oldUser)
          oldUser = Functions.updateProps(oldUser, props)
          const uniqKey = `${User.#KEY}--${oldUser.id}`;
          Redis.set(uniqKey, JSON.stringify(oldUser))
     }

     async del(user){
          const uniqKey = `${User.#KEY}--${user.id}`;
          Redis.del(uniqKey)
     }
}

module.exports = User