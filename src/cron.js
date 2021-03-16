const dayjs = require("dayjs")
const args = require("./args")
const { discord } = require("./discord")

module.exports = {
  launchDaily(cb = () => { }) {
    console.log('Launch daily task')
    return this.interval(async () => {
      await cb()
      console.log('Finish daily task')
    })
  },
  interval(cb) {
    cb()
    return setInterval(() => {
      cb()
    }, getNextInterval());
  },
  wait: (ms) => (new Promise(res => setTimeout(res, ms))),
  waitUntilFirstStart() {
    let nextDate = dayjs()
    if (args.hour != null) {
      nextDate = dayjs().set('hour', args.hour).set('minute', 0).set('seconds', 0)
      if (args.hour <= dayjs().hour()) {
        nextDate = nextDate.add(1, 'day')
      }
    }
    const milliseconds = nextDate.diff(dayjs(), 'milliseconds')
    if (milliseconds > 1000) {
      discord.send(discord.createEmbededReport(true, dayjs().to(nextDate), 'First launch'))
    }
    return this.wait(milliseconds)
  }
}

function getNextInterval() {
  const nbHours = args.interval * 24
  return dayjs().add(nbHours, 'hour').diff(dayjs(), 'milliseconds')
}