
const { renderToString } = require('react-dom/server')
const { createElement } = require('react')
const test = require('tape')
const parse = require('..')

test('parse selector', (t) => {
  const obj = parse(['span#some-id.bold.italic'])

  t.equal(obj.tag, 'span', 'parses the node name')
  t.equal(obj.attrs.id, 'some-id', 'parses an id')
  t.equal(obj.attrs.class, 'bold italic', 'parses class names')
  t.equal(obj.children.length, 0, 'no children')
  t.end()
})

test('parse selector class with attributes', (t) => {
  const obj = parse(['p.italic', { class: 'bold' }])
  t.equal(obj.attrs.class, 'bold italic')
  t.end()
})

test('children', (t) => {
  t.equal(
    parse(['p', 'text node']).children[0],
    'text node',
    'parses a string as children'
  )

  t.deepEqual(
    parse(['p', [
      { tag: 'div' }
    ]]).children[0],
    { tag: 'div' },
    'parses array contents as children'
  )

  t.end()
})

test('attributes', (t) => {
  t.equal(
    parse(['p', { id: 'test' }]).attrs.id,
    'test',
    'one attribute'
  )

  t.deepEqual(
    Object.keys(
      parse(['p', { id: 'test', style: 'background-color: red;' }]).attrs
    ),
    ['id', 'style'],
    'multiple attributes'
  )

  t.end()
})

test('classnames', (t) => {
  const obj = parse(['p', { class: ['one', { 'two': true }] }])
  t.equal(obj.attrs.class, 'one two')
  t.end()
})

test('react', (t) => {
  function h () {
    const { tag, attrs, children } = parse(arguments)
    return createElement(
      tag,
      renameKey('class', 'className', attrs),
      ...children
    )
  }

  const node = h('div.test', { id: 'some-id' }, 'Hello World!')
  t.true(contains(renderToString(node), 'div'), 'renders the right tag')
  t.true(contains(renderToString(node), 'class="test"'), 'contains class')
  t.true(contains(renderToString(node), 'id="some-id"'), 'contains props')
  t.true(contains(renderToString(node), 'Hello World!'), 'contains children')
  t.end()
})

function contains (str, search) {
  return str.indexOf(search) >= 0
}

function renameKey (oldName, newName, _obj) {
  const obj = Object.assign({}, _obj)
  obj[newName] = obj[oldName]
  delete obj[oldName]
  return obj
}
