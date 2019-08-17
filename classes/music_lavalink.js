const fetch = require('node-fetch')
const { URLSearchParams } = require('url')

const events = require('events')
const stableMode = false

module.exports = class MusicServers extends events.EventEmitter {
    constructor (seoa) {
        super()
        this.servers = new Map()
        this.seoa = seoa
    }

    new (gID, channel) {
        this.servers.set(gID, new Server(gID, this.seoa))
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

    set (gID, c, conn) {
        if (!c || c.name !== 'Server') return
        this.servers.set(gID, c)
        if (conn) this._(gID).join(channel)
    }
}

class Server extends events.EventEmitter {
    constructor (gID, seoa) {
        super()
        this.gID = gID
        this.player = null
        this.player = null
        this.skipSafe = false
        this.volume = 50
        this.repeat = false
        this.random = false // un used variable
        this.playing = false
        this.currentSong = {}
        this.songs = []
        this.stableMode = stableMode // Read-only
        this.seoa = seoa
    }

    async _ (channel) {
        if (!channel) return this.emit('notChannel')
        this.player = this.seoa.player.join({
            guild: this.gID,
            channel: channel.id,
            host: this.seoa.player.nodes.first().host
        }, { selfdeaf: false, selfmute: false })
    }

    handler (gID) {
        return new Promise (async (resolve, reject) => {
            try {
                let result = await this.seoa.player.get(gID)
                resolve(result)
            } catch (e) {
                reject(e)
            }
        })
    }

    seek (sec) {
        this.player.seek(sec * 1000 + this.player.state.position)
    }
    
    start () {
        if (!this.player) return
        if (!this.playing) this.play(this.songs.shift())
    }

    play (song) {
        if (!this.player || !song) return
        if (this.repeat) this.songs.push(song)
        this.emit('playing', song)
        this.playing = true
        this.currentSong = song
        this.player.play(this.currentSong.track)
        this.player.volume(this.volume)

        this.player.on('end', dat => {
            this.playing = false
            if (this.skipSafe) {
                this.skipSafe = false
                return this.stop()
            } else if (dat.reason === 'REPLACED') return

            if (this.songs.length > 0) this.play(this.songs.shift())
            else this.stop()
        })
    }

    pause () {
        if (this.player) this.player[this.player.paused ? 'resume' : 'pause']()
    }

    skip () {
        if (this.player) this.player.end()
    }

    stop (cb) {
        if (this.player) {
            this.seoa.player.leave(msg.guild.id)
            delete this.player
        }
        
        cb ? cb() : null
    }

    setVolume (vol) {
        this.emit('changeVol', this.volume, vol)
        this.volume = vol
        if (this.player) this.player.volume(vol)
    }

    add (song, isMyList) {
        if (!isMyList) this.emit('addSong', song)
        this.songs.push(song)
    }

    getSongs (query) {
        const node = this.seoa.player.nodes.first()
        const params = new URLSearchParams()
        params.append('identifier', query)
        return fetch(`http://${node.host}:${node.port}/loadtracks?${params.toString()}`, { headers: { Authorization: node.password } })
            .then(res => res.json())
            .then(data => data.tracks)
            .catch(console.error)
    }

    mylist (lID) {
        /*let myList = mylist[lID]
        this.emit('myList', myList)
        if (myList) myList.forEach(v => { this.add(v, true) })*/
    }
}
