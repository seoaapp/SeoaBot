/**
 * @name Seoa:Music
 * @description Music
 */

const Search = require('../classes').s
exports.run = (seoa, msg, query) => {
  /** 이벤트 중복 등록 방지 */
  if (!seoa.m.servers.has(msg.guild.id)) {
    seoa.m.once(`${msg.guild.id}_add`, _here => {
      _here.on('playing', song => {
        msg.channel.send(`${song.title} (이)가 재생중입니다!`)
      })

      _here.on('alreadyJoined', () => {
        msg.channel.send('이미 접속했대. 만약 오류라면 ``>>>m fix``를 사용해주라9! (찡긋)')
      })

      _here.on('notChannel', () => {
        msg.channel.send('니 채널에 없대')
      })

      _here.on('addSong', song => {
        msg.channel.send(`${song.title} (이)가 대기열에 추가되었습니다.`)
      })

      _here.on('changeVol', (bef, aft) => {
        msg.channel.send(`볼륨이 ${bef * 100}% 에서 ${aft * 100}% (으)로 변경되었습니다.`)
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
      if (0 <= Number(query.args[1]) && Number(query.args[1]) <= 200) here.setVolume(Number(query.args[1]) / 100)
      break
    case 'stop':
      here.stop()
      break
    case 'skip':
      here.skip()
      break
    case 'pause':
      here.pause()
      break
    case 'clear':
      here.clear()
      break
    case 'repeat':
      here.repeat ? here.repeat = false : here.repeat = true
      break
    case 'random':
      here.random ? here.random = false : here.random = true
      break
    case 'now':
      msg.channel.send(`\`\`\`${JSON.stringify(here.currentSong)}\`\`\``)
      break
    case 'search':
      if (!query.args[1]) return
      seoa.search._(query.args.split(1).join(' '), 5).then(res => {
        here.add(res.items[0].video_url)
      })
      break
    case 'fix':
      here.fix(msg.member.voiceChannel)
      break
    case 'mylist':
      if (query.args[1]) here.mylist(query.args[1])
      break
    default:
      msg.channel.send('join, leave, url [URL], play, vol [PERCENTAGE], stop, skip')
  }
}

exports.callSign = ['m']
exports.helps = {
  description: '음악과 관련된 명령어 입니다.',
  uses: 'm'
}
