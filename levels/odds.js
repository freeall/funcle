'use strict'

module.exports = {
  name: 'THE EASY FIRST ONE',
  description: 'It\'s either or, always',
  lastWords: 'An algorithm that returns true if a given number is odd',
  sublevels: [
    {
      input: 1,
      output: true
    }, {
      input: 2,
      output: false
    }, {
      input: -1,
      output: true
    }, {
      input: -100,
      output: false
    }, {
      input: 0,
      output: false
    }
  ],
  tests: [
    {
      input: 1,
      output: true
    }, {
      input: 2,
      output: false
    }, {
      input: 3,
      output: true
    }, {
      input: 4,
      output: false
    }, {
      input: 100,
      output: false
    }, {
      input: 101,
      output: true
    }, {
      input: 1,
      output: true
    }, {
      input: 0,
      output: false
    }, {
      input: 100,
      output: false
    }, {
      input: 31,
      output: true
    }
  ]
}
