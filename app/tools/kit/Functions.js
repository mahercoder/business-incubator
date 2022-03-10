// const { Locales } = require('../../database')
const path = require('path')
const XLSX      = require('xlsx')
const PROVINCES = require('../../database/constants/provinces.json')
const REGIONS = require('../../database/constants/regions.json')
const Locales = require('../../database/locales')
const BotSettings = require('../../database/config/index')
const Logger = require('./Logger')

Array.prototype.sortBy = function(p) {
     return this.slice(0).sort(function(a,b) {
       return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
     })
}

function getProvince(province){
	return PROVINCES[province].name
}

function getRegion(province, region){
	return REGIONS[province][region].name
}

/**
 * Example: matrixify([1,2,3,4,5,6,7,8], 3) === [[1,2,3][4,5,6][7,8]]
 * 
 * @param arr 
 * @param dimen 
 */
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

/**
 * Example: 91 145 98 09 === +998911459809
 * Example: 91 145 98 9 === false
 * Example: +998 91145 98 09 === +998911459809
 * Example: a91 145 98 09 === false
 * 
 * @param @nullable phoneNumber (String)
 */
function phoneNumberDetector(phoneNumber){
     let phone = phoneNumber.replace(/[\+ \-]/g, '')
     phone = phone.match(/^[0-9+]*$/gm)
     
     if(!phone){
         return false
     }
 
     phone = phone[0]
 
     if(phone.length == 12){
         if(phone.substr(0, 3) === '998'){
             phone = '+' + phone
             return phone
         }
     }
     
     if(phone.length == 9){
         phone = '+998' + phone
         return phone
     }
 
     return false
}

function getInnerProp(obj, strPropsArr){
     const curProp = strPropsArr[0]
     if(curProp){
          strPropsArr.shift()
          return getInnerProp(obj[curProp], strPropsArr)
     } else {
          return obj
     }
}

function getText(lang, callback){
     return getInnerProp(Locales[lang].scenes, callback.split('.'))
}

function updateProps(obj, props){
     let newObj = obj
     
     for(let i=0; i < Object.keys(props).length; i++){
       const key = Object.keys(props)[i]
       const value = props[key]
       newObj[key] = value
     }
 
     return newObj
}

async function sendSceneMessageSafely(ctx, caption, keyboard){
     if(ctx.session.currentSceneMsg){
          try{
               ctx.editMessageText(caption, {
                    parse_mode: 'HTML',
                    ...keyboard
               })
               .then( msg => ctx.session.currentSceneMsg = msg)
               .catch( err => {
                    ctx.replyWithHTML(caption, keyboard)
                    .then( msg => ctx.session.currentSceneMsg = msg)
               })
          } catch(err){
               ctx.deleteMessage(ctx.session.currentSceneMsg.message_id)
               .then( () => {
                    ctx.replyWithHTML(caption, keyboard)
                    .then( msg => ctx.session.currentSceneMsg = msg)
               })
               .catch( err => {
                    ctx.replyWithHTML(caption, keyboard)
                    .then( msg => ctx.session.currentSceneMsg = msg)
               })

          }
     } else {
          ctx.replyWithHTML(caption, keyboard)
          .then( msg => ctx.session.currentSceneMsg = msg)
     }
}


/** 
 * Qaytaradi: [ { subscribers: 12344, newComers: 4322, provinceName: "Andijon vil"}, {...}, ]
 * Bu ma'lumotlar keshdan o'qiladi!
*/
async function makeDataForChart(Statistics){
     const result = []
     const yesterdayStat = (await Statistics.getYesterdayStatForProvinces()).sortBy('province')
     const todayStat = (await Statistics.getTodayStatForProvinces()).sortBy('province')

     for(let i=0; i < todayStat.length; i++){
          result.push({
               subscribers: todayStat[i].value, 
               newComers: todayStat[i].value - yesterdayStat[i] ? yesterdayStat[i].value : 0, 
               provinceName: PROVINCES[i].name
          })
     }

     return result
}

function getNextDays(dayCount){
     let result = []
     const months = [
          '',
          'yanvar', 'fevral', 'mart', 'aprel', 
          'may', 'iyun', 'iyul', 'avgust', 
          'sentabr', 'oktabr', 'noyabr', 'dekabr'
     ]

     for(let i=0; i <= dayCount; i++){
          const date = new Date(new Date().getTime() + 5*60*60*1000 + i*24*60*60*1000).toJSON().toString().split('T')[0]
          
          const day = parseInt(date.split('-')[2])
          const month = parseInt(date.split('-')[1])
          const year = parseInt(date.split('-')[0])
          const name = `${parseInt(day)}-${months[parseInt(month)]}`
     
          result.push({
               name, day, month, year
          })
     }

     return result
}

function getDailyHours(){
     let result = []

     for(let i=7; i <= 18; i++){
          const minute = '00'
          const hour = i < 10 ? '0'+i.toString() : i.toString()
          const name = `${hour}:${minute}`

          result.push({
               name, minute, hour
          })
     }

     return result
}

// Keyingi 4 soatlik
function getAvailableHours(currentHour){
     let result = []

     for(let i = currentHour+1; i <= currentHour + 4; i++){
          const minute = '00'
          const hour = i < 10 ? '0'+i.toString() : i.toString()
          const name = `${hour}:${minute}`

          result.push({
               name, minute, hour
          })
     }

     return result
}

function getNow(){
     const fullDate = new Date(new Date().getTime() + 5*60*60*1000)
     const date = fullDate.toJSON().toString().split('T')[0]
     const period = fullDate.toJSON().toString().split('T')[1].split('Z')[0]

     const ms = parseInt(period.split('.')[1])
     const second = parseInt(period.split(':')[2].split('.')[0])
     const minute = parseInt(period.split(':')[1])
     const hour = parseInt(period.split(':')[0])

     const day = parseInt(date.split('-')[2])
     const month = parseInt(date.split('-')[1])
     const year = parseInt(date.split('-')[0])

     return {
          ms, second, minute, hour, day, month, year
     }
}

function getNextTime(hours=0, minutes=0, seconds=0){
     let futureTime = 0
     if(seconds > 0){ futureTime += seconds * 1000 }
     if(minutes > 0){ futureTime += minutes * 60 * 1000 }
     if(hours > 0){ futureTime += hours * 60 * 60 * 1000 }

     const fullDate = new Date(new Date().getTime() + 5*60*60*1000 + futureTime)
     const date = fullDate.toJSON().toString().split('T')[0]
     const period = fullDate.toJSON().toString().split('T')[1].split('Z')[0]

     const ms = parseInt(period.split('.')[1])
     const second = parseInt(period.split(':')[2].split('.')[0])
     const minute = parseInt(period.split(':')[1])
     const hour = parseInt(period.split(':')[0])

     const day = parseInt(date.split('-')[2])
     const month = parseInt(date.split('-')[1])
     const year = parseInt(date.split('-')[0])

     return {
          ms, second, minute, hour, day, month, year
     }
}

function dif2Times(startTime, finishTime){
     if(startTime && finishTime){
          const time_start = new Date()
          const time_end = new Date()
          time_start.setHours(startTime.hour, startTime.minute, startTime.second, startTime.ms)
          time_end.setHours(finishTime.hour, finishTime.minute, finishTime.second, finishTime.ms)
     
          const fullDate = new Date(time_end - time_start)
          const date = fullDate.toJSON().toString().split('T')[0]
          const period = fullDate.toJSON().toString().split('T')[1].split('Z')[0]
     
          const ms = parseInt(period.split('.')[1])
          const second = parseInt(period.split(':')[2].split('.')[0])
          const minute = parseInt(period.split(':')[1])
          const hour = parseInt(period.split(':')[0])
     
          const day = parseInt(date.split('-')[2])
          const month = parseInt(date.split('-')[1])
          const year = parseInt(date.split('-')[0])
     
          return {
               ms, second, minute, hour, day, month, year
          }
     } else {
          return null
     }
}

async function makeWorkSheet(allUsers){
     const userList = []

     for(let i=0; i < allUsers.length; i++){
          const user = allUsers[i]
          if(user.fname && user.lname && user.dname && user.family_structure && user.living_place && user.graduation_place){
               userList.push({ 
                    A: user.fname,
                    B: user.lname,
                    C: user.dname,
                    D: user.family_structure,
                    E: user.living_place,
                    F: user.graduation_place,
                    G: user.completed_year,
                    H: user.language_skill,
                    I: user.sport_skill,
                    J: user.last_work_place,
                    K: user.last_salary,
                    L: user.wish_salary,
                    M: user.can_work_honestly,
                    N: user.can_work_after_work,
                    O: user.can_adhere_working_hours,
                    P: user.which_job_you_want,
                    Q: user.can_work_with_hard,
                    R: user.purpose_of_living,
                    S: user.do_you_pray,
                    T: user.phone
               })
          }
     }

     return userList
}

// returns path for xls file
async function makeExcel(allUsers){
     const workSheet = await makeWorkSheet(allUsers)
     const workbook = XLSX.utils.book_new()
     const filepath = path.join(BotSettings.getTempPath(), `Avtobiografiya.xlsx`)
     
     const ws = XLSX.utils.json_to_sheet(
          [
               { 
                    A: "Ism", 
                    B: "Familiya", 
                    C: "Otasining ismi", 
                    D: "Oila tarkibi", 
                    E: "Turar joyi", 
                    F: "Qayerni tugatgan", 
                    G: "Qaysi yili tugatgan",
                    H: "Qaysi tilni biladi",
                    I: "Yoqtirgan sporti",
                    J: "Oxirgi ish joyi",
                    K: "Oxirgi ish joyidagi maoshi",
                    L: "Qancha maoshga ishlamoqchi",
                    M: "Vijdonan halol ishlay oladimi",
                    N: "Ishdan keyin ishlashga to'g'ri kelsa, ishlaydimi",
                    O: "Ish vaqtiga rioya qiladimi",
                    P: "Qaysi sohada ishlamoqchi",
                    Q: "Shijoat bilan ishlay oladimi",
                    R: "Yashashdan maqsadi",
                    S: "Namoz o'qiydimi",
                    T: "Telefon raqam" 
               }
          ], 
          { header: [ 
               "A", "B", "C", "D", 
               "E", "F", "G", "H", 
               "I", "J", "K", "L", 
               "M", "N", "O", "P", 
               "Q", "R", "S", "T"
          ], skipHeader: true }
     )

     XLSX.utils.sheet_add_json(ws, 
          workSheet, 
          { skipHeader: true, origin: "A2" }
     )

     XLSX.utils.book_append_sheet(workbook, ws, "Avtobiografiya")

     XLSX.writeFile(workbook, filepath)

     return filepath
}

module.exports = {
     getProvince, getRegion,
     matrixify, phoneNumberDetector,
     getText,
     updateProps,
     sendSceneMessageSafely,
     makeDataForChart,
     getNow, getNextTime, dif2Times,
     getNextDays, getDailyHours,
     getAvailableHours,
     makeExcel
}