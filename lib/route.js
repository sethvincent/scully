function parse (route) {
  var split = route.split('/')
  var l = split.length
  var i = 0

  var nodes = [
    {
      path: '/'
    }
  ]

  for (i; i <= l; i++) {
    var node = split[i]
    if (node && node.length) {
      if (node.indexOf(':') === 0) {
        nodes.push({
          param: node.replace(':', '')
        })
      } else if (i <= 1) {
        nodes[0].path += node
      } else if (node) {
        nodes.push({ path: node })
      }
    }
  }

  return nodes
}

function stringify (nodes, param) {
  var route = ''
  var l = nodes.length
  var i = 0

  for (i; i < l; i++) {
    var node = nodes[i]
    if (i === 0) {
      if (node.path.length > 1) {
        route += node.path
      }
    } else if (node.path) {
      route += '/' + node.path
    } else if (node.param) {
      route += '/' + param
    }
  }

  return route
}

module.exports.parse = parse
module.exports.stringify = stringify
