const Model = require('./model')
const conv = require('utimets')

module.exports = class extends Model {
  constructor () {
    super(['m', 'music', '뮤직', '음악'], 'music', 'music')
  }

  async run (msg, args, p) {
    args.splice(0, 1)
    const embed = new p.Embed()
    const policy = p.client.config.localPolicy.music
    const here = msg.client.m._(msg.guild.id, msg.member.voiceChannel)
    if (args[0] === 'join') here._(msg.member.voiceChannel)
    else if (args[0] === 'leave') here.leave()
    else if (args[0] === 'url') {
      if (!args[1]) return
      here.add(args[1])
      here.start()
    } else if (args[0] === 'play') here.start()
    else if (args[0] === 'vol') {
      if (Number(args[1]) >= 0) {
        if (policy.volumeLimit ? Number(args[1]) <= 200 : true) here.setVolume(Number(args[1]) / 100)
        else msg.channel.send('200% 를 넘는 볼륨으로 설정 할 수 없습니다.')
      } else if (args[1]) msg.channel.send('0% 미만의 볼륨으로 설정 할 수 없습니다.')
    } else if (args[0] === 'stop') here.stop()
    else if (args[0] === 'skip') here.skip()
    else if (args[0] === 'pause') here.pause()
    else if (args[0] === 'clear') here.clear()
    else if (args[0] === 'repeat') here.repeat ? here.repeat = false : here.repeat = true
    else if (args[0] === 'random') here.random ? here.random = false : here.random = true
    else if (args[0] === 'now') {
      const u = conv(here.currentSong.length - Math.floor(here.dispatcher.time / 1000))
      embed.addField(':musical_note: **지금 재생중**', `**제목** | ${here.currentSong.title}\n**길이** | ${u[1]}시간 ${u[2]}분 ${u[3]}초 남음`)
        .setThumbnail(here.currentSong.thumbnail)
    } else if (args[0] === 'list') {
      let res = ''
      for (const i in here.songs) res += `[${i}] **제목** | ${here.songs[i].title}\n`
      embed.setTitle(':clipboard: **대기열**').setDescription(res)
    } else if (args[0] === 'search') {
      if (!p.search || !args[1]) return
      embed.setDescription('검색 중입니다 잠시만 기다려 주십시오')
      p.search._(args.splice(1).join(' '), 5).then(res => {
        here.add(res.items[0].id.videoId)
      })
    } else if (args[0] === 'fix') here.fix(msg.member.voiceChannel)
    else if (args[0] === 'stable') here.stableMode = true
    else if (args[0] === 'unstable') here.stableMode = false
    else if (args[0] === 'mylist') {
      const mylist = await p.db.select('mylist', { name: args[1] })
      here.mylist(mylist[0])
    } else {
      const desc = '**[] Optinal, <> Required**\n(p)m <join|leave|stop|skip>\n(p)m <now|queue>\n(p)m <play|repeat|fix>\n(p)m search <query>\n(p)m url <youtube_url>\n(p)m vol <percentage>\n(p)m mylist <mylist_ID>'
      embed.setDescription(desc)
    }
    return { type: 'msg', aft: embed }
  }

  handler (msg, p) {
    if (!p.client.m.servers.has(msg.guild.id)) {
      p.client.m.once(`${msg.guild.id}_add`, _here => {
        _here.on('playing', song => {
          const u = conv(song.length)
          const embed = new p.Embed()
          embed.addField(':cd: **재생중!**', `**제목** | ${song.title}\n**길이** | ${u[1]}시간 ${u[2]}분 ${u[3]}초`)
            .setThumbnail(song.thumbnail)
          msg.channel.send(embed)
        })

        _here.on('alreadyJoined', () => {
          msg.channel.send('이미 접속했대. 만약 오류라면 ``>>>m fix``를 사용해주라9! (찡긋)')
        })

        _here.on('notChannel', () => {
          msg.channel.send('니 채널에 없대')
        })

        _here.on('addSong', song => {
          const embed = new p.Embed()
          embed.addField(':inbox_tray: **대기열 추가됨!**', `${song.title} (이)가 대기열에 추가되었습니다.`)
            .setThumbnail(song.thumbnail)
          msg.channel.send(embed)
        })

        _here.on('myList', m => {
          const embed = new p.Embed()
          embed.addField(':inbox_tray: **대기열 추가됨!**', `<@${m.author}>(이)가 만든 ${m.name} 플레이리스트\n${m.list.length}개의 항목이 대기열에 추가되었습니다.`)
          msg.channel.send(embed)
        })

        _here.on('changeVol', (bef, aft) => {
          const embed = new p.Embed()
          embed.addField(':loud_sound: **볼륨 변경됨!**', `볼륨이 ${bef * 100}% 에서 ${aft * 100}% (으)로 변경되었습니다.`)
          msg.channel.send(embed)
        })
      })
    }
  }
}
