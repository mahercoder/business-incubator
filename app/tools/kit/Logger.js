const path = require('path')
const fs = require('fs')

// returns: 23:54:06
function getTime(){
  const newTime = new Date()
  let seconds = newTime.getSeconds()
  let minutes = newTime.getMinutes()
  let hour    = newTime.getHours()

  if(seconds < 10) seconds=`0`+seconds
  if(minutes < 10) minutes=`0`+minutes
  if(hour    < 10) hour=`0`+hour

  return `${hour}:${minutes}:${seconds}`
}

// returns: 22.11.2020
function getDate(){
  const newDate = new Date()
  let day = newDate.getDate()
  let month = newDate.getMonth()+1
  let year = newDate.getFullYear()

  if(day < 10) day=`0`+day
  if(month < 10) month=`0`+month
  if(year < 10) year=`0`+year

  return `${day}.${month}.${year}`
}

const saveError = (log, err_file_name) => {
  const folder = path.join(__dirname, '/logs')
  if(!fs.existsSync(folder)){ fs.mkdirSync(folder) }
  const file = path.join(__dirname, '/logs/errors.txt')
  const log_time = `*** ${getDate()} | ${getTime()} ***`
  const full_log = `${log_time}\n - Error>\n\tpath: ${err_file_name}\n\ttext: ${log}\n\n`
  
  fs.appendFileSync(file, full_log)
}

module.exports = { saveError }