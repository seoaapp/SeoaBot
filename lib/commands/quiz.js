const Model = require('./model')
const quizs = require('./quizData')
const pointAlias = ['point', '포인트', '점수']
const reactFilter = ['❌', '⭕']
module.exports = class extends Model {
  constructor () {
    super(['quiz', '퀴즈'], 'quiz', 'quiz')
  }

  run (msg, args, p) {
    const embed = new p.Embed().setColor(0x0000ff)
    const f = (r, u) => (reactFilter.includes(r.emoji.name) && u.id === msg.author.id)
    if (pointAlias.includes(args[1])) {

    } else {
      const qN = Math.floor(Math.random() * quizs.length)
      const q = quizs[qN]
      embed.setAuthor(p.lang.get('QUIZ2', [msg.author.username]), msg.author.displayAvatarURL)
        .setTitle(`Quiz No. ${qN}`)
        .addField(`Q. ${q.question.replace('{username}', msg.author.username)}`, p.lang.get('min'))
        .setImage(q.image)
      msg.channel.send(embed).then(_m => {
        reactFilter.forEach(r => _m.react(r))
        _m.awaitReactions(f, { time: 60000, max: 1 }).then(c => {
          const C = c.array()[0]._emoji.name
          const gap = Number(Number(q.answer) === reactFilter.indexOf(C)) || -1
          if (!C) {
            embed.setColor(0x808080)
              .setDescription(p.lang.get('QUIZMSG1'))
              .setAuthor(p.lang.get('Over', [msg.author.username]), msg.author.displayAvatarURL)
          } else {
            if (gap === 1) {
              embed.setColor(0x00ff00)
                .setDescription(p.lang.get('IS'))
                .setAuthor(p.lang.get('SUS', [msg.author.username]), msg.author.displayAvatarURL)
            } else if (gap === -1) {
              embed.setColor(0xff0000)
                .setDescription(p.lang.get('PR'))
                .setAuthor(p.lang.get('NOTCORRECT', [msg.author.username]), msg.author.displayAvatarURL)
            }
          }
          _m.edit(embed.addField(`Q. ${q.question.replace('{username}', msg.author.username)}`, `**A.** ${q.explanation}`))
          p.db.update('userdata', { quizPoint: p.u.quizPoint + gap }, { id: p.u.id })
        })
      })
    }
  }
}
