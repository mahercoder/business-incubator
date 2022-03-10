
function getScenes(){
     return [
          ...require('./admin'),
          ...require('./user')
     ]
}

module.exports = {
     getScenes
}