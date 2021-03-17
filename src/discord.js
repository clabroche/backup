const Discord = require('discord.js');
const args = require('./args')
const client = new Discord.Client();
const axios = require('axios').default;
const {exec} = require('child_process')
const df = require('node-df')
class MyDiscord {
  constructor() {
    this.token = args.discordToken
    this.channelId = args.discordChannel
    this.isDiscordEnabled = args.discordToken && args.discordChannel
    const self = this
    this.commands = {
      '/ISALIVE': {
        cb: this.areYouAlive,
        description: 'Check if i am alive'
      },
      '/HELP': {
        cb: this.help,
        description: 'Show this help'
      },
      '/BACKUP:DF': {
        cb: this.df,
        description: 'Show this help'
      },
    }
  }
  
  ready() {
    if(!this.isDiscordEnabled) return
    return new Promise((res) => {
      client.on('ready', async() => {
        console.log(`Logged in as ${client.user.tag}!`);
        client.on('message', message => {
          if (message.author.bot || message.channel.id !== args.discordChannel) return
          const msg = message.content.toUpperCase().split(' ')[0]
          console.log(msg)
          Object.keys(this.commands).map(command => {
            if (msg === command) {
              this.commands[command].cb.call(this, message.channel, message.content.toLowerCase().replace(command.toLocaleLowerCase(), '').trim())
            }
          })
        });
        const description = `
        ${require('../package.json').version}
        Launched with:
          - Source: ${args.source}
          - Destination: ${args.destination}
          - Backup Interval: ${args.interval} days
          - Number of backup to keep: ${args.nbBackup}
      `
        await this.send(this.createEmbededReport(true, description, 'Hello'))
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

  async df() {
    const options = {
      file: '/',
      prefixMultiplier: 'GB',
      isDisplayPrefixMultiplier: true,
      precision: 2
    };
    df(options, (error, response) => {
      if (error) { throw error; }
      
      const description = response.map(disk => {
        return `
          ${disk.filesystem}: ${disk.available}
          `
      }).join('\n')
      return this.send(this.createEmbededReport(true, description, 'Space available:'))
    });

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
  help() {
    console.log(this.commands)
    return this.send(new Discord.MessageEmbed()
      .setColor('#faa329')
      .setAuthor("Help", "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Lol_question_mark.png/604px-Lol_question_mark.png")
      .setDescription(Object.keys(this.commands).map(command => `- ${command.toLowerCase()}: ${this.commands[command].description}`).join('\n'))
      .setTimestamp()
    )
  }
  areYouAlive(channel, message) {
    const possibilities = [
      "Yes I'm alive ! And you ?",
      "Maybe, I'm just a robot, I don't know...",
      "Yes, but i tell you each days !",
      "You boring me with your questions.",
    ]
    channel.send(possibilities[Math.floor(Math.random() * possibilities.length)]);
  }
} 

async function execPromise (cmd) {
  return new Promise((res, rej) => {
    exec(cmd, (err, stdout, stderr) => {
      if(err || stderr) rej(err)
      res(stdout)
    })
  })

}

module.exports = MyDiscord
module.exports.discord = new MyDiscord()