const { Command, InvalidOptionArgumentError } = require('commander');
const program = new Command();
const pathfs = require('path')
const fse = require('fs-extra')

program
  .requiredOption('-s, --source <path>', 'Path to the source directory')
  .requiredOption('-d, --destination <path>', 'Path to the destination directory', shouldPathExist)
  .requiredOption('-n, --nb-backup  <number>', 'Number of backup to keep', shouldBeNumber)
  .option('--interval  <nbday>', 'how many time to wait to pull a backup', '4')
  .option('--discord-token  <token>', 'Bot token to send message to discord')
  .option('--discord-channel  <channelID>', 'Channel to send messages')
program.parse(process.argv);

const options = program.opts();

const { source, destination, nbBackup, discordToken, discordChannel, interval } = options

module.exports = {
  source, destination, nbBackup, discordToken, discordChannel, interval: +interval
}


function shouldBeNumber(value) {
  if (isNaN(+value)) {
    throw new InvalidOptionArgumentError('Not a number.');
  }
  return +value;
}
function shouldPathExist(value) {
  const path = pathfs.resolve(value)
  if (!fse.existsSync(path)) {
    throw new InvalidOptionArgumentError('Path not found');
  }
  return path;
}