const {discord} = require('./discord')
const dayjs = require('dayjs')
const pathfs = require('path')
const args = require('./args')
const fse = require('fs-extra')
const rsync = require('./rsync')
const PromiseB = require('bluebird')

module.exports = async() => {
  const {destination, source} = args
  const date = dayjs()
  const time = date.format('YYYY-MM-DD-HH:mm:ss')
  const destinationBackup = pathfs.resolve(destination, `backup-${time}`)
  const rsyncArgs = [
    '-e', 'ssh',
    '-ah',
    '--rsync-path', 'sudo rsync',
    '--stats',
    source,
    destinationBackup
  ]
  let rsyncOutput = await rsync(rsyncArgs)
  await deleteBackupIfEmpty(destinationBackup)
  const removedBackups = await deleteOldBackups()
  
  rsyncOutput += `
    Removed Backup:
    ${removedBackups.map(folder => '- ' + folder).join('\n')}
  `
  rsyncOutput += `
    Backups available: ${await (await getAllBackup()).length}
  `
  rsyncOutput += `
    Command: ${rsyncArgs.join(' ')}
  `
  await discord.send(discord.createEmbededReport(true, rsyncOutput))
}

async function deleteBackupIfEmpty(destinationBackup) {
  const isEmpty = fse.readdirSync(destinationBackup).length === 0
  if (isEmpty) {
    await fse.remove(destinationBackup)
    throw new Error('Backup is empty')
  }
} 

async function getAllBackup() {
  const { destination } = args
  return fse.readdir(destination)
}
async function deleteOldBackups() {
  const {destination, nbBackup} = args
  const allBackup = await getAllBackup()
  const nbBackupToRemove = allBackup.length - nbBackup
  const backupToRemove = allBackup.slice(0, nbBackupToRemove >= 0 ? nbBackupToRemove : 0)
  const emptyDirPath = pathfs.resolve('empty')
  await fse.remove(emptyDirPath).catch(err => { })
  await fse.mkdir(emptyDirPath)
  await PromiseB.map(backupToRemove, async path => {
    console.log(pathfs.resolve(destination, path))
    const rsyncres = await rsync([
      '-a', '--force', '--delete', emptyDirPath + '/', pathfs.resolve(destination, path)
    ])
    console.log(rsyncres)
    await fse.remove(pathfs.resolve(destination, path))
  })
  await fse.remove(emptyDirPath).catch(err => { })
  return backupToRemove
}