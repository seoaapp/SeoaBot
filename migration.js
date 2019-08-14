const Umysql = require('umysql')
console.log('SEOABOT JSON TO MYSQL MIGRATION TOOL')
console.log('CONNECTING TO MYSQL SERVER')
const db = new Umysql(process.env.host, process.env.user, process.env.pass, 'seoa')

console.log('LOADING OLD JSON DATA')
const users = require('./UserData/users.json')
const servers = require('./ServerData/servers.json')
const owners = require('./ServerData/owners.json')
const sIDs = Object.keys(servers)
const uIDs = Object.keys(users)

console.log('OLD DATA WRITING TO MYSQL SERVER')
console.log('ServerData/servers.json & ServerData/owners.json')
sIDs.forEach(sID => {
  db.insert('serverdata', { id: sID, lang: servers[sID].lang, owner: owners[sID] })
})

console.log('UserData/users.json')
uIDs.forEach(uID => {
  db.insert('userdata', { id: uID, quizPoint: users[uID].quizPoint })
})

console.log('MIGRATION ENDED')