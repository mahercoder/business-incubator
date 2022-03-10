// const path = require('path')

const MONTHS = [
     {name: 'yanvar', dayCount: 31}, 
     {name: 'fevral', dayCount: 28}, 
     {name: 'mart', dayCount: 31}, 
     {name: 'aprel', dayCount: 30}, 
     {name: 'may', dayCount: 31},
     {name: 'iyun', dayCount: 30},
     {name: 'iyul', dayCount: 31},
     {name: 'avgust', dayCount: 31},
     {name: 'sentabr', dayCount: 30},
     {name: 'oktabr', dayCount: 31},
     {name: 'noyabr', dayCount: 30},
     {name: 'dekabr', dayCount: 31},
]

const subjects = [
     { id: 0, name: "Ona tili va adabiyot", visible: false, exp: 0 },
     { id: 1, name: "Matematika", visible: false, exp: 0 },
     { id: 2, name: "Fizika", visible: false, exp: 0 },
     // { id: 3, name: "Kimyo", visible: false, exp: 0 },
     // { id: 4, name: "Biologiya", visible: false, exp: 0 },
     // { id: 5, name: "Ingliz tili", visible: false, exp: 0 }
     
     // {id: 6, name: "Русский язык", visible: false, exp: 0},
     // {id: 7, name: "Geografiya", visible: false, exp: 0},
     // {id: 8, name: "O'zb. tarixi", visible: false, exp: 0},
     // {id: 9, name: "Jahon tarixi", visible: false, exp: 0},
     // {id: 10, name: "Informatika", visible: false, exp: 0}
]

const cards = [{
     name: 'Uzcard',
     number: '8600 0417 5764 2948'
},{
     name: 'Visa',
     number: '4231 2000 0943 5495'
},{
     name: 'WebMoney WMZ',
     number: 'Z369139735949'
}]

const editors = [{
     name: "Izzatillo Ismoilov (Andijon)",
     job: "Admin:",
     link: undefined
},{
     name: "G'ulomov Lazizbek (Andijon)",
     job: "Admin:",
     link: undefined 
},{
     name: "Qo'ldashev Abrorbek (Andijon)",
     job: "Admin:",
     link: undefined 
},{
     name: "Mohirbek Odiljonov (Farg'ona)",
     job: "Tashkilotchi va dasturchi:",
     link: "https://t.me/mohirbek_blog"
}]

const DEFAULTS = {

// ENERGY
     // Bonus in a energy
     REFERAL_SENDER_BONUS: 5,
     // Bonus in a energy
     REFERAL_RECEIVER_BONUS: 5,
     // Everyone gets 5 energy every day
     DAILY_ENERGY: 5,
     // Bahsda mag'lub bo'lgandan 1 energiya olib tashlanadi
     LOOSER_ENERGY: -1,

// STAR
     // In a star
     CORRECT_FOR_TEST: 4,
     // In a star
     INCORRECT_FOR_TEST: -2,
     // In a star
     NOT_SELECTED_FOR_TEST: -1,

// LINK
     REFERAL_LINK: 'https://t.me/testxonabot?start=', // 'https://t.me/telegrafo_bot?start='
     CHANNEL_USERNAME: "@testxona",
     CHANNEL_LINK: "https://t.me/testxona",
     FEEDBACK_BOT_LINK: "https://t.me/testxona_feedback_bot",
     ADS_GUIDE: "https://telegra.ph/Yoriqnoma-10-28",
     ADS_DEAL_LINK: "https://t.me/testxona_hamkorlik/30", // "https://t.me/testxona_reklama/19"
     PARTNER_DEAL_LINK: "https://t.me/testxona_hamkorlik/38"
}

const Provinces = require('./provinces.json')
const Regions = require('./regions.json')

// const SystemConfig = {
//      // Foydalanuvchilar ma'lumotlarini zaxiralash uchun maxsus papka:
//      backupPath: path.join(__dirname, '..', '/data'),
//      // Foydalanuvchilar ma'lumotlarini arxivlash uchun maxsus papka:
//      archivePath: path.join(__dirname, '..', '/archive'),
     
//      // Bitta faylda saqlanadigan foydalanuvchi ma'lumotlarining maksimal miqdori:
//      // (10000 ta foydalanuvchi bitta faylda)
//      maxDistCount: 1000
// }

// const AdSettings = {
//      Channel: {
//           // Necha soat topda turadi
//           // Top`da turish narxi quyidagicha belgilanadi:
//           // price = subscribers * (topTimes / 15 minute)
//           topTimes: [30, 60, 90, 120],
          
//           // Necha soat lentada turadi:
//           // Lentada turish narxi quyidagicha belgilanadi:
//           // price = subscribers * (lentTime / 6 hours)
//           lentaTimes: [12, 24, 36, 48],

//           // Maksimal necha kun oldin reklama sotib olish mumkin
//           maxOrderDays: 6, // Maksimal 7 kun oldin reklama sotib olish mumkin!

//           // Reklama kunning qaysi soatlarida joylanadi
//           // [06:00, 12:00, 18:00]
//           publishHours: [6, 12, 18]
//      },
//      Bot: {
//           // Reklama kunning qaysi soatlarida joylanadi
//           // [06:00, 12:00, 18:00]
//           publishHours: [6, 18],

//           // Maksimal necha kun oldin reklama sotib olish mumkin
//           maxOrderDays: 7, // Maksimal 7 kun oldin reklama sotib olish mumkin!
//      }
// }

module.exports = {
     OWNER1_ID: 543588222,
     OWNER2_ID: 792684458,
     WORK_CHANNEL_ID: -1001796873193,
     CARDS: cards,
     ...DEFAULTS,
     SUBJECTS: subjects,
     EDITORS: editors,
     PROVINCES: Provinces, 
     REGIONS: Regions,
     
     // MONTHS
     
     // SYSTEM_CONFIG: SystemConfig,

     // AD_SETTINGS: AdSettings
}