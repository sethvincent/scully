var fs = require('fs')
var path = require('path')
var mkdir = require('mkdirp')
var each = require('each-async')
var createHTML = require('create-html')
var route = require('./route')

module.exports = function createFiles (options, callback) {
  var argv = options.argv
  var output = options.output
  var toString = options.toString
  var collectionKeys = Object.keys(options.collections)

  each(collectionKeys, function (key, i, next) {
    var collection = options.collections[key]
    collection.namespace = collection.namespace || key
    var collectionOutput = path.join(output, collection.namespace)
    var urlpath = route.stringify(collection.parsedRoute, '')
    var dirpath = options.output + urlpath
    var filepath = dirpath + '/index.html'
    writeItems(collection, next)  
  }, callback)

  function writeItems (collection, done) {
    var itemKeys = Object.keys(collection.items)

    each(itemKeys, function (itemKey, i, next) {
      var item = collection.items[itemKey]
      var params = {}
      params[collection.namespace] = item.filename
      var urlpath = route.stringify(collection.parsedRoute, item.filename)
      var dirpath = options.output + urlpath
      var filepath = dirpath + '/index.html'

      writeFile(dirpath, filepath, urlpath, next)
    }, done)
  }

  function writeFile (dirpath, filepath, urlpath, next) {
    var opts = {
      title: options.site.title,
      head: '<meta name="viewport" content="width=device-width, initial-scale=1">',
      body: toString(urlpath, options),
      script: options.site.baseurl + 'bundle.js',
      css: options.site.baseurl + 'bundle.css'
    }

    mkdir.sync(dirpath)
    var html = createHTML(opts)
    fs.writeFile(filepath, html, next)
  }
}
