
const parseSelector = require('./selector')
const cn = require('classnames')

module.exports = parse

function parse (args) {
  let children = []
  let attrs = {}
  let selector

  for (var i = args.length - 1; i >= 0; i--) {
    const arg = args[i]

    if (Array.isArray(arg)) {
      children = arg
    } else if (isObj(arg)) {
      attrs = arg
    } else if (isString(arg) && i === 0) {
      selector = parseSelector(arg)
    } else {
      children = [arg]
    }
  }

  selector.id && (attrs.id = selector.id)

  const classes = cn(attrs.class, selector.classes.join(' '))
  classes && (attrs.class = classes)

  return {
    tag: selector.tag,
    attrs,
    children
  }
}

function isString (val) { return typeof val === 'string' }
function isObj (val) { return typeof val === 'object' }
