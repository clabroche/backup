const args = require("./args")

module.exports = {
  launchDaily(cb = () => { }) {
    console.log('Launch daily task')
    return this.interval(1000 * 60 * 60 * 24 * args.interval, async function () {
      await cb()
      console.log('Finish daily task')
    })
  },
  interval(intervalNumber, cb) {
    cb()
    return setInterval(() => {
      cb()
    }, intervalNumber);
  }
}
