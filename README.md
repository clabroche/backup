# Backup

Backup tools using rsync.

You can make copies of remote folders.

## Installation
``` npm i```

## Usage

Params:
 -  -s, --source <path>        Path to the source directory
 -  -d, --destination <path>   Path to the destination directory
 -  -n, --nb-backup  <number>  Number of backup to keep
 -  --interval  <nbday>             how many time to wait to pull a backup (default: "4")
 -  --discord-token  <token>        Bot token to send message to discord
 -  --discord-channel  <channelID>  Channel to send messages
 -  --hour  <0-24>                  When begin the backup
 -  -h, --help                      display help for command