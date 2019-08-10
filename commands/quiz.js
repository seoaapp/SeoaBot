/**
 * @name Seoa:Quiz
 * @description Quiz command
 */

const QuizData = require('../QuizData/quizs.json')
const discord = require('discord.js')
const fs = require('fs')

const i18n = require('i18n')

exports.run = async (seoa, msg, settings) => {
  let server = await settings.db.select('serverdata', { id: msg.guild.id })
  server = server[0]
  let user = await settings.db.select('userdata', { id: msg.author.id })
  user = user[0]
  const msgArray = msg.content.split(' ')
  const filter = (reaction, user) =>
    (reaction.emoji.name === '⭕' || reaction.emoji.name === '❌') &&
    user.id === msg.author.id

  let quizNum
  if (msg.content.includes('point') || msg.content.includes('포인트')) {
    msg.channel.send(
      i18n.__(
        { phrase: 'PointMsg', locale: server.lang },
        user.quizPoint
      )
    )
  } else {
    if (!msgArray[1]) {
      quizNum = Math.floor(Math.random() * QuizData.length)
      /**  } else {
          if (msgArray[1] < QuizData.length) {
            quizNum = Math.floor(msgArray[1])
          } else if ((QuizData.filter(quiz => quiz.language === msgArray[1])).length > 0) {
            const quizsFiltered = QuizData.filter(quiz => quiz.language === msgArray[1])
            quizNum = QuizData.indexOf(quizsFiltered[Math.floor(Math.random() * (quizsFiltered.length - 1))])
          } else {
            const quizNumberNotExist = new discord.RichEmbed()
              .setColor(0xff0000)
              .addField('퀴즈 No. ' + msgArray[1] + '(을)를 찾을 수 없습니다.', '퀴즈는 No. ' + (QuizData.length - 1) + '까지만 등록되어 있습니다.')
            return msg.channel.send(quizNumberNotExist)
          }
        } */
      const quizEmbed = new discord.RichEmbed()
        .setColor(0x0000ff)
        .setAuthor(
          i18n.__(
            { phrase: 'QUIZ2', locale: server.lang },
            msg.author.username
          ),
          msg.author.displayAvatarURL
        )
        .setTitle('Quiz No.' + quizNum)
        .addField(
          'Q. ' +
            QuizData[quizNum].question.replace(
              '{username}',
              msg.author.username
            ),
          i18n.__({
            phrase: 'min',
            locale: server.lang
          })
        )
      if (QuizData[quizNum].image) {
        quizEmbed.setImage(QuizData[quizNum].image)
      }
      msg.channel.send(quizEmbed).then((th) => {
        if (Math.floor(Math.random() * 1)) {
          th.react('⭕')
          setTimeout(() => {
            th.react('❌')
          }, 1000)
        } else {
          th.react('❌')
          setTimeout(() => {
            th.react('⭕')
          }, 1000)
        }
        th.awaitReactions(filter, {
          time: 60000,
          max: 1
        }).then((collected) => {
          if (!collected.array()[0]) {
            const quizFailByLate = new discord.RichEmbed()
              .setColor(0x808080)
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
                'Q. ' +
                  QuizData[quizNum].question.replace(
                    '{username}',
                    msg.author.username
                  ),
                '**A.** ' + QuizData[quizNum].explanation
              )
            if (QuizData[quizNum].image) {
              quizFailByLate.setImage(QuizData[quizNum].image)
            }
            th.edit(quizFailByLate)
            user.quizPoint--
            settings.db.update('userdata', { quizPoint: user.quizPoint }, { id: msg.author.id })
          } else {
            let Quizanswer
            if (QuizData[quizNum].answer === true) {
              Quizanswer = '⭕'
            } else if (QuizData[quizNum].answer === false) {
              Quizanswer = '❌'
            }

            // 맞았을 경우
            if (collected.array()[0].emoji.name === Quizanswer) {
              const quizCorrectEmbed = new discord.RichEmbed()
                .setColor(0x00ff00)
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
                    QuizData[quizNum].question.replace(
                      '{username}',
                      msg.author.username
                    ),
                  '**A.** ' + QuizData[quizNum].explanation
                )
              if (QuizData[quizNum].image) {
                quizCorrectEmbed.setImage(QuizData[quizNum].image)
              }
              th.edit(quizCorrectEmbed)
              user.quizPoint++
              settings.db.update('userdata', { quizPoint: user.quizPoint }, { id: msg.author.id })
            } else {
              // 틀렸을 경우
              const quizNotCorrectEmbed = new discord.RichEmbed()
                .setColor(0xff0000)
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
                    QuizData[quizNum].question.replace(
                      '{username}',
                      msg.author.username
                    ),
                  '**A.** ' + QuizData[quizNum].explanation
                )
              if (QuizData[quizNum].image) {
                quizNotCorrectEmbed.setImage(QuizData[quizNum].image)
              }
              th.edit(quizNotCorrectEmbed)
              user.quizPoint--
              settings.db.update('userdata', { quizPoint: user.quizPoint }, { id: msg.author.id })
            }
          }
        })
      })
    }
  }
}

exports.callSign = ['quiz', 'Quiz', '퀴즈']
exports.helps = {
  description: '프로그래밍에 대한 퀴즈를 풀 수 있습니다.',
  uses: '>quiz'
}
