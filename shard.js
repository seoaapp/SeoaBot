const fs = require('fs')
const { ShardingManager: Shard } = require('discord.js')
const manager = new Shard('./seoa.js')

if (!fs.existsSync('./ServerData/')) {
  fs.mkdirSync('./ServerData')
  fs.writeFileSync('./ServerData/servers.json', '{}')
  fs.writeFileSync('./ServerData/owners.json', '{}')
}

if (!fs.existsSync('./UserData/')) {
  fs.mkdirSync('./UserData')
  fs.writeFileSync('./UserData/users.json', '{}')
}

manager.spawn(5)

manager.on('launch', (shard) => {
  console.log('Sharded: ' + shard.id)
})
