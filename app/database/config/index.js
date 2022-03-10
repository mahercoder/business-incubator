const fs = require('fs')
const path = require('path')
const Configuration = require('./index.json')

const TEMP_PATH = path.join(__dirname, '..', '/temp')

// [/temp] mavjud bo'lmasa uni ochadi
if(!fs.existsSync(TEMP_PATH)){
     fs.mkdirSync(TEMP_PATH)
     Configuration.tempPath = TEMP_PATH
     fs.writeFileSync(path.join(__dirname, './index.json'), JSON.stringify(Configuration))
}

Configuration.tempPath = TEMP_PATH

function getTempPath(){
     return Configuration.tempPath
}

function getOwners(){
     return Configuration.owners
}

function setAdmin(userId){
     Configuration.admins.push(userId)
     fs.writeFileSync(path.join(__dirname, './index.json'), JSON.stringify(Configuration))
}

async function getAdmins(ctx){
     let result = `Admin topilmadi!`
     
     if(Configuration.admins.length > 0){
          result = ''
     }

     for(let i=0; i < Configuration.admins.length; i++){
          result = `<a href="tg://user?id=${Configuration.admins[i]}">${i+1}-admin</a> - <code>${Configuration.admins[i]}</code>`
     }

     return result
}

function getAdminIds(){
     return Configuration.admins
}

function removeAdmin(userId){
     for(let i=0; i < Configuration.admins.length; i++){
          if(userId == Configuration.admins[i]){
               Configuration.admins.splice(i, 1)
          }
     }

     fs.writeFileSync(path.join(__dirname, './index.json'), JSON.stringify(Configuration))
}

function getPartnerChannels(){
     return Configuration.partnerChannels
}

function addPartnerChannel(chat_id){
     Configuration.partnerChannels.push(chat_id)

     fs.writeFileSync(path.join(__dirname, './index.json'), JSON.stringify(Configuration))
}

function removePartnerChannel(index){
     Configuration.partnerChannels.splice(index, 1)
     fs.writeFileSync(path.join(__dirname, './index.json'), JSON.stringify(Configuration))
}

function setStopCount(newStopCount){
     Configuration.stopCount = newStopCount
     fs.writeFileSync(path.join(__dirname, './index.json'), JSON.stringify(Configuration))
}

function getStopCount(){
     return Configuration.stopCount;
}

function getStartTime(){
     return Configuration.startTime
}

function getStopTime(){
     return Configuration.stopTime
}

// Hamkor kanalda bot mavjudligi va adminligini tekshirish
async function isBotAdminHere(ctx, chat_id){
     try{
         const admins = await ctx.telegram.getChatAdministrators(chat_id)
         const bot_username = ctx.botInfo.username
     
          for(let i=0; i < admins.length; i++){
               if(admins[i].user.username == bot_username){
                  return true
               }
          }
     } catch(err){
          if(err){
               return false
          }
     }
 
     return false
}

// Hamkor kanallarning barchasiga obuna bo'lganligini tekshirish
async function isSubscribed(ctx){
     let result = true
	const partnerChannels = Configuration.partnerChannels
	
     for(let i=0; i < partnerChannels.length; i++){
          try {
               const user = await ctx.telegram.getChatMember(partnerChannels[i], ctx.from.id)

               if(user.status == 'left' || user.status == 'kicked' || user.status == 'restricted'){
                    result = false;
               }
          } catch(err) {
               if(err.code == 400){
                    result = false
               }
          }
     }

     return result
}

// userId owner`ga tegishli bo'lsa true, aks holda false
function isOwner(userId){
     let result = false
     const owners = getOwners()
     
     for(let i=0; i < owners.length; i++){
         if(userId == owners[i]){
             result = true
         }
     }
 
     return result
}

// userId egasi bot'ni boshqara oladigan adminmi?
function isAdmin(userId){
     let result = false
     const admins = Configuration.admins
     
     for(let i=0; i < admins.length; i++){
         if(userId == admins[i]){
             result = true
         }
     }
 
     return result
}

module.exports = {
     getTempPath,
     getOwners,
     getStartTime, getStopTime,
     getPartnerChannels, addPartnerChannel, removePartnerChannel,
     getStopCount, setStopCount,
     isOwner, isAdmin, 
     isBotAdminHere, isSubscribed,
     setAdmin, getAdmins, getAdminIds, removeAdmin
}