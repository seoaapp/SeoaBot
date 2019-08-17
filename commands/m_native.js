/**
 * @name Seoa:Music
 * @description Music
 */

exports.run = (seoa, msg, query) => {
  /** 이벤트 중복 등록 방지 */
  if (!seoa.m.servers.has(msg.guild.id)) {
    seoa.m.once(`${msg.guild.id}_add`, _here => {
      _here.on('playing', song => {
        msg.reply(JSON.stringify(song))
      })
    
      _here.on('alreadyJoined', () => {
        msg.reply('이미 접속했대')
      })
    
      _here.on('notChannel', () => {
        msg.reply('니 채널에 없대')
      })
    
      _here.on('addSong', song => {
        msg.reply(JSON.stringify(song))
      })

      _here.on('changeVol', (bef, aft) => {
        msg.reply(`${bef*100}% => ${aft*100}%`)
      })
    })
  }

  let here = seoa.m._(msg.guild.id, msg.member.voiceChannel)
  switch (query.args[0]) {
    case 'join':
      here._(msg.member.voiceChannel)
      break
    case 'leave':
      here.leave()
      break
    case 'url':
      if (!query.args[1]) return
      here.add(query.args[1])
      here.start()
      break
    case 'play':
      here.start()
      break
    case 'vol':
      if (query.args[1] && Number(query.args[1])) here.setVolume(Number(query.args[1]) / 100)
      break
    case 'stop':
      here.stop()
      break
    case 'skip':
      here.skip()
      break
    case 'fix':
      here.fix(msg.member.voiceChannel)
      break
    case 'mylist':
      if (query.args[1]) here.mylist(query.args[1])
      break
    default:
      msg.reply('join, leave, url [URL], play, vol [PERCENTAGE], stop, skip')
  }
}

exports.callSign = ['m']
exports.helps = {
  description: '음악과 관련된 명령어 입니다.',
  uses: 'm'
}
