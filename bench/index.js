
const bench = require('fastbench')
const parse = require('../src')

const run = bench([hyperscript], Math.pow(10, 5))

function hyperscript (done) {
  parse(['p', { id: 'id', class: 'pad red' }, 'Hello!'])
  process.nextTick(done)
}

run()
