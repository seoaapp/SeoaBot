const Model = require('./model')
module.exports = class extends Model {
  constructor () {
    super(['leader', 'leaderboard', '리더보드', '리더', '보드'], 'leaderboard', 'leaderboard')
  }

  async run (msg, args, p) {
    let res = `\`\`\`fix\n${p.lang.get('LeaderBoardMsg')}\n`
    const usrs = await p.client.db.select('userdata', null, 'order by quizPoint desc limit 10')
    console.log(usrs)
    usrs.forEach((_u, i) => {
      const u = p.client.users.find(U => U.id === _u.id)
      res += p.lang.get('LeaderBoardMsg1', [i + 1, u ? u.username : `UNKNOWN(${_u.id})`, _u.quizPoint])
    })
    return { type: 'msg', aft: `${res}\`\`\`` }
  }
}
