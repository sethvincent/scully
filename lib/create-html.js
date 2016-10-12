var fs = require('fs')
var path = require('path')
var createHTML = require('create-html')

module.exports = function (options, callback) {
  var argv = options.argv
  var output = options.output
  var toString = options.toString
  var filepath = path.join(output, 'index.html')

  var opts = {
    title: options.site.title,
    head: '<meta name="viewport" content="width=device-width, initial-scale=1">',
    body: toString(options.site.baseurl, options),
    script: options.site.baseurl + 'bundle.js',
    css: options.site.baseurl + 'bundle.css'
  }

  var html = createHTML(opts)
  fs.writeFile(filepath, html, callback)
}
