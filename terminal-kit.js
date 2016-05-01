'use strict'

const term = require('terminal-kit').terminal

term.multiline = function (width, mutltiStr) {
  const parts = mutltiStr.split(' ')
  let str = ''
  parts.forEach(function (part) {
    if (`${str} ${part}`.length <= width) {
      str += str ? ' ' + part : part
    } else {
      term(str)
      term.move(- str.length, 1)
      str = part
    }
  })

  term(str)
  return term
}

module.exports = term
