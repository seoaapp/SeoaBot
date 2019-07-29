const { ShardingManager: Shard } = require('discord.js')
const manager = new Shard('./seoa.js')

manager.spawn(5)

manager.on('launch', (shard) => {
  console.log('Sharded: ' + shard.id)
})
