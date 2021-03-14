require('./args')
const { discord } = require('./discord')
const backup = require('./backup')
const failed = require('./failed')
const cron = require('./cron')
;(async _ => {
  await discord.ready()
  await cron.launchDaily(backup)
})().catch(failed)
