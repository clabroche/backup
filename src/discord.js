const Discord = require('discord.js');
const args = require('./args')
const client = new Discord.Client();
const axios = require('axios').default;
class MyDiscord {
  constructor() {
    this.token = args.discordToken
    this.channelId = args.discordChannel
    this.isDiscordEnabled = args.discordToken && args.discordChannel
  }
  ready() {
    if(!this.isDiscordEnabled) return
    return new Promise((res) => {
      client.on('ready', async() => {
        console.log(`Logged in as ${client.user.tag}!`);
        await this.send(this.createEmbededReport(true, require('../package.json').version, 'Hello'))
        res()

      });
      client.login(this.token);
    })
  }
  /** @param {string | import('discord.js').MessageEmbed} msg */
  send(msg) {
    if (!this.isDiscordEnabled) return
    console.log('Send to Discord')
    // @ts-ignore
    return client.channels.cache.get(this.channelId).send(msg)
  }
  
  
  /** @param {string} msg */
  sendWithApi(msg) {
    if (!this.isDiscordEnabled) return
    axios.post(`https://discord.com/api/v6/channels/${this.channelId}/messages`, msg, {
      headers: {
        Authorization: `Bot ${this.token}`
      }
    })
  }
  createEmbededReport(isGood = true, description, _title) {
    if (!this.isDiscordEnabled) return
    let title = isGood ? 'Success' : 'Failed'
    if (_title) title = _title
    const icon = isGood ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Check_green_icon.svg/1200px-Check_green_icon.svg.png' : 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flat_cross_icon.svg/1024px-Flat_cross_icon.svg.png'
    const color = isGood ? '#6db546' : '#d45657'
    return new Discord.MessageEmbed()
      .setColor(color)
      .setAuthor(title, icon)
      .setDescription(description)
      .setTimestamp()
      .setFooter('', icon);
  }
} 
module.exports = MyDiscord
module.exports.discord = new MyDiscord()