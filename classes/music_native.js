const ytdl = require('ytdl-core')
const fs = require('fs')
const events = require('events')
const path = require('path')
const stableMode = true

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
    this.conn = null
    this.dispatcher = null
    this.skipSafe = false
    this.volume = 1
    this.repeat = false
    this.random = false
    this.playing = false
    this.currentSong = null
    this.songs = []
    this.stableMode = stableMode
  }

  async _ (channel) {
    if (!channel) return this.emit('notChannel')
    if (this.conn) return this.emit('alreadyJoined')
    this.conn = await channel.join()
  }

  start (query) {
    if (!this.conn) return
		if (this.playing) return
		if (query) this.add(query)
		this.play(this.random ? this.songs.splice(Math.floor(Math.random() * this.songs.length), 1) : this.songs.shift())
	}
	
	clear () {
		this.songs = []
	}

  play (song) {
    if (!this.conn || !song) return
    if (this.repeat) this.songs.push(song)
    this.emit('playing', song)
    this.playing = true
    this.skipSafe = false
    this.currentSong = song
    this.dispatcher = this.stableMode
      ? this.conn.playFile(song.path)
      : this.conn.playStream(ytdl(song.url, { filter: 'audioonly', quality: 'highest' }))
    this.dispatcher.setVolume(this.volume)

    this.dispatcher.on('error', err => {
      this.emit('error', err)
      this.skip()
    })

    this.dispatcher.on('end', () => {
      this.playing = false
      if (this.skipSafe) return this.stop(true)
      if (this.songs.length > 0) this.play(this.songs.shift())
      else this.stop(true)
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
			if ((typeof cb) === 'undefined') {
				this.skipSafe = true
      	this.dispatcher.end()
			}
      delete this.dispatcher
    }

    if ((typeof cb) === 'function') cb()
  }

  setVolume (vol) {
    this.emit('changeVol', this.volume, vol)
    this.volume = vol
    if (this.dispatcher) this.dispatcher.setVolume(vol)
  }

  async add (url, isMyList) {
		let inf = await ytdl.getInfo(url)
    const song = new Song(inf)
		if (!isMyList) this.emit('addSong', song)
		if (stableMode) {
			if (!fs.existsSync(song.path)) {
        let stream = ytdl(url, { filter: 'audioonly', quality: 'highest' })
        stream.pipe(fs.createWriteStream(song.path))
        stream.on('error', () => { return this.add(url, isMyList) })
      }
    }
    return this.songs.push(song)
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

  mylist (m) {
    if (!m) return
    m.list = JSON.parse(m.list)
    this.emit('myList', m)
    m.list.forEach(v => {
      this.add(v, true)
    })
  }
}

class Song {
  constructor (inf) {
    this.url = inf.video_url
		this.title = inf.title
		this.author = inf.author.name
    this.length = inf.length_seconds
    this.vID = inf.video_id
		this.thumbnail = inf.player_response.videoDetails.thumbnail.thumbnails[3].url
    this.path = path.join(__dirname, `./stream/${this.vID}.mp3`)
  }
}
