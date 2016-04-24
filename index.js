#!/usr/bin/env node
'use strict'

const readline = require('readline')
const fs = require('fs')
const vm = require('vm')
const path = require('path')

const levels = [
  require('./levels/odds'),
  require('./levels/even')
]

if (process.argv[2] === '--reset') {
  fs.unlinkSync(path.join(__dirname, 'savegame.json'))
  console.log('All savegame data has been cleared')
  process.exit(0)
}

const hasSaveGame = fs.existsSync(path.join(__dirname, 'savegame.json'))

if (hasSaveGame) {
  const savegame = require('./savegame.json')
  ask(savegame.level, savegame.sublevel, onasked)
} else {
  ask(0, 0, onasked)
}

function onasked (levelIndex, sublevelIndex) {
  fs.writeFileSync(path.join(__dirname, 'savegame.json'), JSON.stringify({
    level: levelIndex,
    sublevel: sublevelIndex
  }))

  checkSublevel(levelIndex, sublevelIndex, oncheck)

  function oncheck (err, checked) {
    if (err) {
      clearScreen()
      console.log([
        'There was an error:',
        err.message,
        ''
      ].join('\n'))
      prompt('Hit enter when you are ready', function () {
        ask(levelIndex, sublevelIndex, onasked)
      })

      return
    }

    clearScreen()

    const level = levels[levelIndex]
    const str = [
      `${level.name} - ${level.description}`,
      '',
      'Let\'s see how your algorithm is doing:'
    ]

    checked.results.forEach(function (res, i) {
      const sublevel = level.sublevels[i]

      str.push(`#${i}: ${res ? '✓' : '÷'} ${sublevel.input} => ${sublevel.output}`)
    })

    console.log(str.join('\n') + '\n')

    const isLastLevel = levelIndex === levels.length - 1
    const isLastSublevel = sublevelIndex === level.sublevels.length - 1
    const isAllSublevelsCorrect = checked.results.every(x => x)
    const isAllTestsCorrect = checked.tests.every(x => x)
    const correctTests = checked.tests.filter(x => x === true).length
    const incorrectTests = checked.tests.filter(x => x === false).length

    if (isAllSublevelsCorrect && isLastSublevel && isAllTestsCorrect && isLastLevel) {
      console.log('Game done, thanks for playing!')
      return
    }

    if (isAllSublevelsCorrect && isLastSublevel && isAllTestsCorrect) {
      console.log([
        'Well done young padawan. Here\'s the description of what you just solved:',
        level.lastWords,
        ''
      ].join('\n'))

      prompt('Continue to next level', function () {
        ask(levelIndex + 1, 0, onasked)
      })
      return
    }

    if (isAllSublevelsCorrect && isLastSublevel && !isAllTestsCorrect) {
      console.log([
        'Your algorithm solved all the hints...',
        'However, there are some hidden checks that your algorithms did not answer correct to.',
        '',
        'Check the hints again, and keep thinking...',
        '',
        `As a little bonus info, ${correctTests} out of ${checked.tests.length} checks were correct`,
      ].join('\n'))

      prompt('', function () {
        ask(levelIndex, sublevelIndex, onasked)
      })
      return
    }

    if (isAllSublevelsCorrect) {
      prompt('Well done. Ready to next hint', function () {
        ask(levelIndex, sublevelIndex + 1, onasked)
      })
      return
    }

    prompt('Sorry buddy, check your code again', function () {
      ask(levelIndex, sublevelIndex, onasked)
    })
  }
}

function ask (levelIndex, sublevelIndex, cb) {
  const level = levels[levelIndex]
  const sublevel = level.sublevels[sublevelIndex]
  const str = [
    `${level.name} - ${level.description}`,
    '',
    'Hints:'
  ]

  for (var i = 0; i <= sublevelIndex; i++) {
    str.push(`#${i}: ${level.sublevels[i].input} => ${level.sublevels[i].output}`)
  }

  str.push(`\nThese are the hints for your algorithm. Write your algorithm in level${levelIndex}.js`)

  clearScreen()

  console.log(str.join('\n'))

  prompt(`When you are ready, hit enter`, function () {
    cb(levelIndex, sublevelIndex)
  })
}

function checkSublevel (levelIndex, sublevelIndex, cb) {
  const filename = `level${levelIndex}.js`
  const level = levels[levelIndex]

  if (!fs.existsSync(`./${filename}`)) {
    fs.writeFileSync(`./${filename}`, 'function answer (input) {\n  return null\n}\n')
  }

  const sandbox = {}
  const context = new vm.createContext(sandbox)

  const source = fs.readFileSync(`./${filename}`)
  const answerScript = new vm.Script(source)
  answerScript.runInContext(context)

  if (!sandbox.answer || typeof sandbox.answer !== 'function') {
    return cb(new Error('Your source file needs to have defined a function called answer'))
  }

  const results = []

  for (var i = 0; i <= sublevelIndex; i++) {
    const sublevel = level.sublevels[i]
    const testScript = new vm.Script(`__output = answer(${sublevel.input})`)
    testScript.runInContext(context)

    // doesn't work with complex types
    const isCorrect = sandbox.__output === sublevel.output

    results.push(isCorrect)

    delete sandbox.__output
  }

  const tests = []

  for (var i = 0; i < level.tests.length; i++) {
    const test = level.tests[i]
    const testScript = new vm.Script(`__output = answer(${test.input})`)
    testScript.runInContext(context)

    // doesn't work with complex types
    const isCorrect = sandbox.__output === test.output

    tests.push(isCorrect)

    delete sandbox.__output
  }

  cb(null, {
    results: results,
    tests: tests
  })
}

function clearScreen () {
  process.stdout.write(`\u001bc`)
}

function prompt(str, cb) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.question(str, function () {
    rl.close()
    cb()
  })
}
