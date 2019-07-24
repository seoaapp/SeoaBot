const discord = require('discord.js')
const seoa = require('./seoa')
/** Sharding */
const shard = new discord.ShardingManager('./seoa.js', {
  totalShards: 4,
  token: seoa.settings.token
})

shard.spawn()

shard.on('launch', (shard) => {
  console.log('Sharded: ' + shard.id)
})
