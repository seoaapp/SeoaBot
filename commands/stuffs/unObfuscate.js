/*

  The MIT License (MIT)

  Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

/*jshint strict:false */

module.exports = {
  detect: function(str) {
    return (
      /^var _?[0O1lI]{3}\=('|\[).*\)\)\)/.test(str) ||
      (/^function _?[0O1lI]{3}\(_/.test(str) && /eval\(/.test(str)) ||
      false
    )
  },

  unpack: function(str) {
    if (MyObfuscate.detect(str)) {
      var __eval = eval
      try {
        eval = function(unpacked) {
          // jshint ignore:line
          if (MyObfuscate.starts_with(unpacked, 'var _escape')) {
            // fetch the urlencoded stuff from the script,
            var matches = /'([^']*)'/.exec(unpacked)
            var unescaped = unescape(matches[1])
            unpacked = unescaped
          }
          // throw to terminate the script
          throw unpacked
        } // jshint ignore:line
        __eval(str) // should throw
      } catch (e) {
        // well, it failed. we'll just return the original, instead of crashing on user.
        if (typeof e === 'string') {
          str = e
        }
      }
      eval = __eval // jshint ignore:line
    }
    return str
  },

  starts_with: function(str, what) {
    return str.substr(0, what.length) === what
  },

  ends_with: function(str, what) {
    return str.substr(str.length - what.length, what.length) === what
  },
}
