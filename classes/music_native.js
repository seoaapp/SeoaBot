const ytdl = require('ytdl-core')
const fs = require('fs')
const events = require('events')
const stableMode = false

let mylist = {}
module.exports = class MusicServers extends events.EventEmitter {
  constructor () {
    super()
    this.servers = new Map()
  }

  new (gID, channel) {
    this.servers.set(gID, new Server(gID))
    let here = this._(gID)
    this.emit(`${gID}_add`, here)
    if (channel) here._(channel)
    return here
  }

  _ (gID, channel) {
    let res = this.servers.get(gID)
    if (!res) {
      this.new(gID, channel)
      return this._(gID)
    }
    return res
  }

  set (gID, c, channel) {
    if (!c || c.name !== 'Server') return
    this.servers.set(gID, c)
    if (channel) this._(gID).join(channel)
  }
}

class Server extends events.EventEmitter {
  constructor (gID) {
    super()
    this.gID = gID
    this.conn
    this.dispatcher
    this.skipSafe = false
    this.volume = 1
    this.repeat = false
    this.random = false // un used variable
    this.playing = false
    this.currentSong
    this.songs = []
    this.stableMode = stableMode // Read-only
  }

  async _ (channel) {
    if (!channel) return this.emit('notChannel')
    if (this.conn) return this.emit('alreadyJoined')
    this.conn = await channel.join()
  }

  start () {
    if (!this.conn) return
    if (!this.playing) this.play(this.songs.shift())
  }

  play (song) {
    if (!this.conn || !song) return
    if (this.repeat) this.songs.push(song)
    this.emit('playing', song)
    this.playing = true
    this.skipSafe = false
    this.currentSong = song
    this.dispatcher = stableMode
      ? this.conn.playFile(song.path)
      : this.conn.playStream(
        ytdl(song.url, { filter: 'audioonly', quality: 'highestaudio' })
      )
    this.dispatcher.setVolume(this.volume)

    this.dispatcher.on('error', err => {
      this.emit('error', err)
      this.songs = [this.currentSong].concat(this.songs)
      this.skip()
    })

    this.dispatcher.on('end', () => {
      this.playing = false
      if (this.skipSafe) {
        this.skipSafe = false
        return this.stop()
      }

      if (this.songs.length > 0) this.play(this.songs.shift())
      else this.stop()
    })
  }

  pause () {
    if (this.dispatcher) { this.dispatcher[this.dispatcher.paused ? 'resume' : 'pause']() }
  }

  fix (channel) {
    if (!channel) return
    if (this.currentSong) this.songs = [this.currentSong].concat(this.songs)
    this.playing = false
    this.leave()
    this._(channel)
    this.start()
  }

  skip () {
    if (this.dispatcher) this.dispatcher.end()
  }

  stop (cb) {
    if (this.dispatcher) {
      this.skipSafe = true
      this.dispatcher.end()
      delete this.dispatcher
    }

    cb ? cb() : null
  }

  setVolume (vol) {
    this.emit('changeVol', this.volume, vol)
    this.volume = vol
    if (this.dispatcher) this.dispatcher.setVolume(vol)
  }

  add (url, isMyList) {
    const song = new Song(url)
    if (!isMyList) this.emit('addSong', song)
    this.songs.push(song)
  }

  leave () {
    if (this.conn) this.disconnect()
  }

  disconnect () {
    if (!this.conn) return
    this.skipSafe = true
    this.conn.disconnect()
    delete this.conn
  }

  mylist (lID) {
    let myList = mylist[lID]
    this.emit('myList', myList)
    if (myList) {
      myList.forEach(v => {
        this.add(v, true)
      })
    }
  }
}

class Song {
  constructor (url) {
    this.url = url
    this.title
    this.length
    this.vID
    this.thumbnail
    this.path
    ytdl.getInfo(url).then(inf => {
      this.title = inf.title
      this.length = inf.length_seconds
      this.vID = inf.video_id
      this.thumbnail = inf.thumbnail_url
      if (!stableMode) return
      this.path = `./stream/${this.vID}.mp3`
      if (!fs.existsSync(this.path)) {
        ytdl(url, { filter: 'audioonly', quality: 'highestaudio' }).pipe(
          fs.createWriteStream(this.path)
        )
      }
    })
  }
}
