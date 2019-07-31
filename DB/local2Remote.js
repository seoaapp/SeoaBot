/**
 * @name Seoa:DB/local2Remote
 * @description Send Local JSONData to Remote DataBase
 */

const db = require('rethinkdb')

const localData = {
  ServerData: require('../ServerData/servers.json'),
  UserData: require('../UserData/users.json')
}

db.connect({ host: 'pmh.dps0340.xyz', port: 28015, db: 'seoa', user: process.argv[2], password: process.argv[3] }, (err, conn) => {
  if (err) console.error(err)
  else {
    console.log('로그인, 성공적')
    db.db('seoa').table('UserData').insert(localData.UserData).run(conn, (error, res) => {
      if (error) console.error(error)
      else console.log('UserData 처리됨')
    })
    db.db('seoa').table('ServerData').insert(localData.ServerData).run(conn, (error, res) => {
      if (error) console.error(error)
      else console.log('ServerData 처리됨')
    })
  }
})
