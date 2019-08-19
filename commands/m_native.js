/**
 * @name Seoa:Music
 * @description Music
 */

const conv = require('./stuffs/convertTime')
exports.run = (seoa, msg, query) => {
  /** 이벤트 중복 등록 방지 */
  if (!seoa.m.servers.has(msg.guild.id)) {
    seoa.m.once(`${msg.guild.id}_add`, _here => {
      _here.on('playing', song => {
        let u = conv(song.length)
        msg.channel.send(`:cd: **재생중!**\n**제목** | ${song.title}\n**길이** | ${u[1]}시간 ${u[2]}분 ${u[3]}초`)
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
    console.log(query.args)
    if (query.args[0] === 'join') here._(msg.member.voiceChannel)
    else if (query.args[0] === 'leave') here.leave()
    else if (query.args[0] === 'url') {
      if (!query.args[1]) return
      here.add(query.args[1])
      here.start()
    } else if (query.args[0] === 'play') here.start()
    else if (query.args[0] === 'vol') {
      if (0 <= Number(query.args[1]) && Number(query.args[1]) <= 200) here.setVolume(Number(query.args[1]) / 100)
    } else if (query.args[0] === 'stop') here.stop()
    else if (query.args[0] === 'skip') here.skip()
    else if (query.args[0] === 'pause') here.pause()
    else if (query.args[0] === 'clear') here.clear()
    else if (query.args[0] === 'repeat') here.repeat ? here.repeat = false : here.repeat = true
    else if (query.args[0] === 'random') here.random ? here.random = false : here.random = true
    else if (query.args[0] === 'now') {
      let u = conv(here.currentSong.length - Math.floor(here.dispatcher.time / 1000))
      msg.channel.send(`:musical_note: **지금 재생중**\n**제목** | ${here.currentSong.title}\n**길이** | ${u[1]}시간 ${u[2]}분 ${u[3]}초 남음`)
    } else if (query.args[0] === 'list') {
      let res = '***대기열***\n'
      for (let i in here.songs) {
        res += `[${i}] **제목** | ${here.songs[i].title}\n`
      }
      msg.channel.send(res)
    } else if (query.args[0] === 'search') {
      if (!query.args[1]) return
      seoa.search._(query.args.splice(1).join(' '), 5).then(res => {
        here.add(res.items[0].id.videoId)
      })
    } else if (query.args[0] === 'fix') here.fix(msg.member.voiceChannel)
    else if (query.args[0] === 'stable') here.stableMode = true
    else if (query.args[0] === 'unstable') here.stableMode = false
    else if (query.args[0] === 'mylist') if (query.args[1]) here.mylist(query.args[1])
}

exports.callSign = ['m']
exports.helps = {
  description: '음악과 관련된 명령어 입니다.',
  uses: 'm'
}
