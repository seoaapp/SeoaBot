/**
 * @name Seoa:settings
 * @description settings Command
 * @Thank https://stackoverflow.com/questions/37817334/javascript-bubble-sort
 */

// i18n (locale)
const i18n = require('i18n')
i18n.configure({
  directory: './locales'
})

function bubble (arr) {
  var len = arr.length
  for (var i = 0; i < len; i++) {
    for (var j = 0; j < len - i - 1; j++) {
      if (arr[j].quizPoint < arr[j + 1].quizPoint) {
        const temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }
  return arr
}

exports.run = (seoa, msg, settings, query) => {
  const scores = require('../UserData/users.json')
  let arr = []

  for (const score in scores) {
    arr[arr.length] = scores[score]
  }

  arr = bubble(arr).slice(0, parseInt(query.args[1]) || 20)

  let temp =
    '```fix\n' +
    i18n.__({
      phrase: 'LeaderBoardMsg',
      locale: settings.servers[msg.guild.id].lang
    }) +
    '\n'
  arr.forEach((leader, th) => {
    temp += i18n.__(
      {
        phrase: 'LeaderBoardMsg1',
        locale: settings.servers[msg.guild.id].lang
      },
      th + 1,
      leader.name,
      leader.quizPoint
    )
  })
  temp += '```'
  msg.channel.send(temp)
}

exports.callSign = ['leader', 'leaderboard', '리더보드', '리더', '보드']
exports.helps = {
  description: '리더보드를 보여줍니다',
  uses: '>leaderboard'
}
