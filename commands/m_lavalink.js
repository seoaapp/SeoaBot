/**
 * @name Seoa:Music
 * @description Music
 */

exports.run = async (seoa, msg, query) => {
  if (!seoa.settings.owners.includes(msg.author.id)) return
  /** 이벤트 중복 등록 방지 */
  seoa.ready()
  if (!seoa.lm.servers.hasOwnProperty(msg.guild.id)) {
    seoa.lm.once(`${msg.guild.id}_add`, _here => {
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
        msg.reply(`${bef}% => ${aft}%`)
      })
    })
  }

  let here = seoa.lm._(msg.guild.id, msg.member.voiceChannel)
  switch (query.args[0]) {
    case 'join':
      here._(msg.member.voiceChannel)
      break
    case 'leave':
      here.leave()
      break
    case 'search':
      if (!query.args[1]) return
      here.getSongs(`ytsearch: ${query.args.splice(1).join(' ')}`).then(song => {
        if (song[0]) here.add(song[0])
      })
      here.start()
      break
    case 'play':
      here.start()
      break
    case 'vol':
      if (Number(query.args[1])) here.setVolume(Number(query.args[1]))
      break
    case 'seek':
      if (Number(query.args[1])) here.seek(Number(query.args[1]))
      break
    case 'stop':
      here.stop()
      break
    case 'skip':
      here.skip()
      break
    case 'mylist':
      if (query.args[1]) here.mylist(query.args[1])
      break
    default:
      msg.reply('join, leave, url [URL], play, vol [PERCENTAGE], stop, skip')
  }
}

exports.callSign = ['lm']
exports.helps = {
  description: '음악과 관련된 명령어 입니다. (사용 불가)',
  uses: 'lm'
}
