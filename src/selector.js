
module.exports = parseSelector

function parseSelector (selector) {
  const matches = selector.split(/([\.#]?[^\s#.]+)/)
  let classes = []
  let id = null
  let tag = null

  if (matches.length === 3) return { tag: selector, classes }

  matches.forEach((match) => {
    const s = match.substring(1, match.length)
    if (!match) return

    if (match[0] === '.') {
      classes.push(s)
    } else if (match[0] === '#') {
      id = s
    } else {
      tag = match
    }
  })

  return { classes, id, tag }
}
