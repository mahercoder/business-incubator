const { Scenes } = require('telegraf')
const { BaseScene } = Scenes

const scene = new BaseScene('signup')

scene.enter(async ctx => {
     ctx.session.signup_user = {}
     ctx.scene.enter('fname')
})

module.exports = [
     scene,
     require('./fname'),
     require('./projectname'),
     require('./workplace'),
     require('./getfile')
]