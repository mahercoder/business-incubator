const { Scenes } = require('telegraf')
const { Stage } = Scenes
const { getScenes } = require('../../scenes')

const scenes = getScenes()
const stage = new Stage(scenes)

module.exports = stage.middleware()