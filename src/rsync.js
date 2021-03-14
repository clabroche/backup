const { spawn } = require('child_process')
module.exports = function (args) {
  let lines = ''
  return new Promise((res, rej) => {
    const rsync = spawn('rsync', args)
    rsync.stdout.on('data', line => {
      lines += line.toString('utf-8')
    })
    rsync.stderr.on('data', line => {
      lines += line.toString('utf-8')
    })
    rsync.on('exit', (code) => {
      if (code !== 0) return rej(lines)
      res(lines)
    })
  })
}