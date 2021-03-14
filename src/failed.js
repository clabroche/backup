const {discord} = require('./discord')
module.exports = async (err) => {
  console.error(err)
  if (discord) {
    await discord.createEmbededReport(false, err)
  }
}
