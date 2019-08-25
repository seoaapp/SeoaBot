/**
 * @name Seoa:Quiz
 * @description Quiz command
 */

const QuizData = require('../QuizData/quizs.json')
const discord = require('discord.js')

const i18n = require('i18n')

exports.run = async (seoa, msg) => {
  let server = await seoa.db.select('serverdata', { id: msg.guild.id })
  server = server[0]
  let user = await seoa.db.select('userdata', { id: msg.author.id })
  user = user[0]

  if (msg.content.includes('point') || msg.content.includes('포인트')) {
    msg.channel.send(
      i18n.__({ phrase: 'PointMsg', locale: server.lang }, user.quizPoint)
    )
  } else {
    let quizNum = Math.floor(Math.random() * QuizData.length)
    let quiz = QuizData[quizNum]
    const quizEmbed = new discord.RichEmbed()
      .setColor('#0000ff')
      .setAuthor(
        i18n.__({ phrase: 'QUIZ2', locale: server.lang }, msg.author.username),
        msg.author.displayAvatarURL
      )
      .setTitle('Quiz No.' + quizNum)
      .addField(
        'Q. ' + quiz.question.replace('{username}', msg.author.username),
        i18n.__({
          phrase: 'min',
          locale: server.lang
        })
      )
    if (quiz.image) quizEmbed.setImage(quiz.image)
    msg.channel.send(quizEmbed).then(th => {
      th.react('❌')
      th.react('⭕')
      th.awaitReactions(
        (reaction, user) => (reaction.emoji.name === '⭕' || reaction.emoji.name === '❌') && user.id === msg.author.id,
        { time: 60000, max: 1 }
      ).then(collected => {
        if (!collected.array()[0]) {
          const quizFailByLate = new discord.RichEmbed()
            .setColor('#808080')
            .setDescription(
              i18n.__({
                phrase: 'QUIZMSG1',
                locale: server.lang
              })
            )
            .setAuthor(
              i18n.__(
                {
                  phrase: 'Over',
                  locale: server.lang
                },
                msg.author.username
              ),
              msg.author.displayAvatarURL
            )
            .setTitle('Quiz No.' + quizNum)
            .addField(
              'Q. ' + quiz.question.replace('{username}', msg.author.username),
              '**A.** ' + quiz.explanation
            )
          if (quiz.image) quizFailByLate.setImage(quiz.image)
          th.edit(quizFailByLate)
          user.quizPoint--
          seoa.db.update(
            'userdata',
            { quizPoint: user.quizPoint },
            { id: msg.author.id }
          )
        } else {
          // 맞았을 경우
          if (collected.array()[0].emoji.name === quiz.awnser ? '⭕' : '❌') {
            const quizCorrectEmbed = new discord.RichEmbed()
              .setColor('#00ff00')
              .setDescription(
                i18n.__({
                  phrase: 'IS',
                  locale: server.lang
                })
              )
              .setAuthor(
                i18n.__(
                  {
                    phrase: 'SUS',
                    locale: server.lang
                  },
                  msg.author.username
                ),
                msg.author.displayAvatarURL
              )
              .setTitle('Quiz No.' + quizNum)
              .addField(
                'Q. ' +
                  quiz.question.replace('{username}', msg.author.username),
                '**A.** ' + quiz.explanation
              )
            if (quiz.image) quizCorrectEmbed.setImage(quiz.image)
            th.edit(quizCorrectEmbed)
            user.quizPoint++
            seoa.db.update(
              'userdata',
              { quizPoint: user.quizPoint },
              { id: msg.author.id }
            )
          } else {
            // 틀렸을 경우
            const quizNotCorrectEmbed = new discord.RichEmbed()
              .setColor('#ff0000')
              .setDescription(
                i18n.__({
                  phrase: 'PR',
                  locale: server.lang
                })
              )
              .setAuthor(
                i18n.__(
                  {
                    phrase: 'NOTCORRECT',
                    locale: server.lang
                  },
                  msg.author.username
                ),
                msg.author.displayAvatarURL
              )
              .setTitle('Quiz No.' + quizNum)
              .addField(
                'Q. ' +
                  quiz.question.replace('{username}', msg.author.username),
                '**A.** ' + quiz.explanation
              )
            if (quiz.image) quizNotCorrectEmbed.setImage(quiz.image)
            th.edit(quizNotCorrectEmbed)
            user.quizPoint--
            seoa.db.update(
              'userdata',
              { quizPoint: user.quizPoint },
              { id: msg.author.id }
            )
          }
        }
      })
    })
  }
}

exports.callSign = ['quiz', 'Quiz', '퀴즈']
exports.helps = {
  description: '프로그래밍에 대한 퀴즈를 풀 수 있습니다.',
  uses: 'quiz'
}
