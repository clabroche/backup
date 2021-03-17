require('./args')
const { discord } = require('./discord')
const backup = require('./backup')
const failed = require('./failed')
const cron = require('./cron')
const dayjs = require('dayjs');
var duration = require('dayjs/plugin/duration')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
dayjs.extend(duration)
;(async _ => {
  await discord.ready()
  await discord.df()
  await cron.waitUntilFirstStart()
  await cron.launchDaily(backup)
})().catch(failed)

