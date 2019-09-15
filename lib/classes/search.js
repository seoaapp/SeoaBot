const request = require('request')

const apiUrl = 'https://www.googleapis.com/youtube/v3/search'
const method = 'GET'

/**
 * YoutubeSearcher
 * @class YoutubeSearcher
 */
class YoutubeSearcher {
  /**
   * @param {String} key 구글에서 제공한 유튜브 API 키
   */
  constructor (key) {
    this.apiKey = key
    this.part = 'id'
    this.params = {}
    this.allowParams = [
      'channelId',
      'channelType',
      'eventType',
      'onBehalfOfContentOwner',
      'order',
      'pageToken',
      'publishedAfter',
      'publishedBefore',
      'regionCode',
      'safeSearch',
      'topicId',
      'type',
      'videoCaption',
      'videoCategoryId',
      'videoDefinition',
      'videoDimension',
      'videoDuration',
      'videoEmbeddable',
      'videoLicense',
      'videoSyndicated',
      'videoType'
    ]
    this.allowParts = ['id', 'snippet']
  }

  /**
   * @param {String} t 파라미터 키
   * @param {String} v 파라미터 값
   * @returns {YoutubeSearcher}
   */
  addParam (t, v) {
    if (!t || !this.allowParams.includes(t)) return
    this.params[t] = v
    return this
  }

  /**
   * @param {String} v 검색할 때 불러올 파트
   * @returns {YoutubeSearcher}
   */
  setPart (v) {
    if (!v || !this.allowParts.includes(v)) return
    this.part = v
    return this
  }

  /**
   * @param {String} q 유튜브에 검색할 검색어
   * @param {Number} c 검색할 갯수
   * @param {?Function} cb 콜백
   * @returns {Promise | undefined} 검색 결과 Promise 또는 없음 (콜백이 없는 경우 Promise로 반환)
   */
  _ (q, c, cb) {
    if (cb) return this.search(q, c, cb)
    else return this.promiseSearch(q, c)
  }

  /**
   * @param {String} q 유튜브에 검색할 검색어
   * @param {Number} c 검색할 갯수
   * @param {?Function} cb 콜백
   * @param {?Function} pRes Promise Resolve Function
   * @param {?Function} pRej Promise Reject Function
   * @returns {undefined} 콜백 또는 Promise Function를 통하여 검색 결과가 리턴됩니다.
   */
  search (q, c, cb, pRes, pRej) {
    this.params.q = q
    this.params.key = this.apiKey
    this.params.part = this.part
    this.params.maxResults = c || 5
    const temp = new URL(apiUrl)

    Object.keys(this.params).forEach(k => {
      temp.searchParams.append(k, this.params[k])
    })

    request(temp.href, { method: method, timeout: 1000 }, (err, res) => {
      res = JSON.parse(res.body)
      pRej && pRes
        ? err
          ? pRej(err)
          : pRes(res)
        : cb
          ? cb(err, res)
          : console.log('자네 "_" 메서드를 사용하지 않겠나?')
    })
  }

  /**
   * @param {String} q 유튜브에 검색할 검색어
   * @param {Number} c 검색할 갯수
   * @returns {Promise} 검색 결과
   */
  promiseSearch (q, c) {
    return new Promise((resolve, reject) => {
      this.search(q, c, null, resolve, reject)
    })
  }
}

module.exports = YoutubeSearcher
