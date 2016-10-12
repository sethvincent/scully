var path = require('path')
var assert = require('assert')
var read = require('read-directory')
var each = require('each-async')

var parseItem = require('./parse-collection-item')

module.exports = function readCollection (options, callback) {
  assert.ok(options, 'options object is required')
  assert.ok(options.dir, 'collection directory is required as options.dir property')
  var collection = { items: {} }
  collection.dir = options.dir
  var home

  read(options.dir, options, function (err, results) {
    var filenames = Object.keys(results)
    each(filenames, function (filename, i, next) {
      parseItem(filename, results[filename], null, function (err, parsed) {
        if (err) return next(err)
        collection.items[parsed.filename] = parsed
        if (parsed.data.home) {
          home = parsed
        }
        next()
      })
    }, function (err) {
      if (err) return callback(err)
      callback(null, {
        collection: collection,
        home: home
      })
    })
  })
}
