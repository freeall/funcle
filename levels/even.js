'use strict'

module.exports = {
  name: 'THE SECOND, BUT STILL EASY',
  description: 'It\'s the opposite',
  lastWords: 'An algorithm that returns true if a given number is even',
  sublevels: [
    {
      input: 1,
      output: false
    }, {
      input: 2,
      output: true
    }, {
      input: -1,
      output: false
    }, {
      input: -100,
      output: true
    }, {
      input: 0,
      output: true
    }
  ],
  tests: [
    {
      input: 1,
      output: false
    }, {
      input: 2,
      output: true
    }, {
      input: 3,
      output: false
    }, {
      input: 4,
      output: true
    }, {
      input: 100,
      output: true
    }, {
      input: 101,
      output: false
    }, {
      input: 1,
      output: false
    }, {
      input: 0,
      output: true
    }, {
      input: 100,
      output: true
    }, {
      input: 31,
      output: false
    }
  ]
}
