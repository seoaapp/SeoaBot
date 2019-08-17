const request = require('request')

const apiUrl = 'https://www.googleapis.com/youtube/v3/search'
const method = 'GET'

module.exports = class YoutubeSearcher {
    constructor (key) {
        this.apiKey = key
        this.part = 'id'
        this.params = {}
        this.allowParams = ['channelId', 'channelType', 'eventType', 'onBehalfOfContentOwner', 'order', 'pageToken', 'publishedAfter', 'publishedBefore', 'regionCode', 'safeSearch', 'topicId', 'type', 'videoCaption', 'videoCategoryId', 'videoDefinition', 'videoDimension', 'videoDuration', 'videoEmbeddable', 'videoLicense', 'videoSyndicated', 'videoType']
        this.allowParts = ['id', 'snippet']
    }

    addParam (t, v) {
        if (!t || !this.allowParams.includes(t)) return
        this.params[t] = v
        return this
    }

    setPart (v) {
        if (!v || !this.allowParts.includes(v)) return
        this.part = v
        return this
    }

    _ (q, c, cb) {
        if (cb) return this.search(q, c, cb)
        else return this.promiseSearch(q, c)
    }

    search (q, c, cb, pRes, pRej) {
        this.params['q'] = q
        this.params['key'] = this.apiKey
        this.params['part'] = this.part
        this.params['maxResults'] = c || 5
        let temp = new URL(apiUrl)

        Object.keys(this.params).forEach(k => {
            temp.searchParams.append(k, this.params[k])
        })

        request(temp.href, { method: method, timeout: 1000 }, (err, res) => {
            res = JSON.parse(res.body)
            pRej && pRes ? (err ? pRej(err) : pRes(res)) : (cb ? cb(err, res) : console.log('자네 "_" 메서드를 사용하지 않겠나?'))
        })
    }

    promiseSearch (q, c) {
        return new Promise((resolve, reject) => {
            this.search(q, c, null, resolve, reject)
        })
    }
}