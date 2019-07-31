/**
 * @name Seoa:settings
 * @description settings Command
 * @Thank https://stackoverflow.com/questions/37817334/javascript-bubble-sort
 */

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

  let temp = '```fix\nSeoaBot Code Quiz LeaderBoard\n'
  arr.forEach((leader, th) => {
    temp += (th + 1) + '등: ' + leader.name + '(' + leader.quizPoint + '점)\n'
  })
  temp += '```'
  msg.channel.send(temp)
}

exports.callSign = ['leader', 'leaderboard', '리더보드', '리더', '보드']
exports.helps = {
  description: '리더보드를 보여줍니다',
  uses: '>leaderboard'
}
