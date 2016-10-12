var assert = require('assert')
var path = require('path')
var choo = require('choo')

module.exports = function createApp (options, layouts) {
  assert.ok(options, 'options object is required')
  assert.ok(options.site, 'options.site object is required')

  var app = choo()
  options.site.home = options.home
  app.model(require('./models/site')(options.site))
  app.model(require('./models/data')(options.data))

  var keys = Object.keys(options.collections)

  keys.forEach(function (key) {
    var model = require('./models/collection')(options.collections[key])
    app.model(model)
  })

  app.router(function (route) {
    var routes = []

    keys.forEach(function (key) {
      var collection = options.collections[key]
      routes.push(route(options.collections[key].route, getLayout(key, collection, layouts)))
    })

    return routes
  })

  return app
}

function getLayout (key, collection, layouts) {
  return function (state, prev, send) {
    var keys = Object.keys(state.params)

    // this assumes there's only one param is that bad
    var namespace = keys[0]

    if (collection.layout && layouts[collection.layout]) {
      return layouts[collection.layout](state, prev, send)
    } else if (layouts[namespace]) {
      return layouts[namespace](state, prev, send)
    }

    return layouts.default(state, prev, send)
  }
}
