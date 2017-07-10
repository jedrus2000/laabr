const test = require('ava')
const helpers = require('./_helpers')
const utils = require('../src/utils')

test('return passed in value', (t) => {
  t.is(utils.noop('foobar'), 'foobar')
})

test('return `true` because of valid json-like string', (t) => {
  t.truthy(utils.isJSON('({foobar})'))
})

test('return `false` because of invalid json-like string', (t) => {
  t.false(utils.isJSON('{foobar}'))
  t.false(utils.isJSON('(foobar)'))
  t.false(utils.isJSON('{(foobar)}'))
})

test('return stringified value', (t) => {
  t.is(utils.stringify('foo-bar'), '"foo-bar"')
})

test.cb.serial('do not override `console` methods with `server.log`', (t) => {
  const consoleClone = Object.assign({}, console)

  helpers.getServer({ override: false }, (server) => {
    t.is(console.trace, consoleClone.trace)
    t.is(console.log, consoleClone.log)
    t.is(console.info, consoleClone.info)
    t.is(console.warn, consoleClone.warn)
    t.is(console.error, consoleClone.error)
    t.end()

    Object.assign(console, consoleClone)
  })
})

test.cb.serial('override `console` methods with `server.log`', (t) => {
  const consoleClone = Object.assign({}, console)

  helpers.getServer({ override: true }, (server) => {
    t.not(console.trace, consoleClone.trace)
    t.not(console.log, consoleClone.log)
    t.not(console.info, consoleClone.info)
    t.not(console.warn, consoleClone.warn)
    t.not(console.error, consoleClone.error)
    t.is(console.trace.name, 'bound wrapper')
    t.is(console.log.name, 'bound wrapper')
    t.is(console.info.name, 'bound wrapper')
    t.is(console.warn.name, 'bound wrapper')
    t.is(console.error.name, 'bound wrapper')
    t.end()

    Object.assign(console, consoleClone)
  })
})
