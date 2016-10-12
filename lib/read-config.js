var path = require('path')
var assert = require('assert')
var xtend = require('xtend')
var route = require('./route')

module.exports = function (config) {
  assert.ok(config, 'config object is required')
  var cfg = xtend({
    collections: {}
  }, config)

  Object.keys(cfg.collections).forEach(function (key) {
    var col = config.collections[key]
    config.collections[key].parsedRoute = route.parse(col.route)
  })

  return cfg
}
