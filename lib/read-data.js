var path = require('path')
var assert = require('assert')
var read = require('read-directory')
var each = require('each-async')

var parseItem = require('./parse-collection-item')

module.exports = function readData (options, callback) {
  assert.ok(options, 'options object is required')
  assert.ok(options.dir, 'directory is required as options.dir property')
  var data = {}

  read(options.dir, options, function (err, results) {
    var filenames = Object.keys(results)
    each(filenames, function (filename, i, next) {
      data[filename] = require(path.join(options.dir, filename))
      next()
    }, function (err) {
      if (err) return callback(err)
      callback(null, data)
    })
  })
}
