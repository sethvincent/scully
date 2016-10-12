var path = require('path')
var tar = require('tar-fs')

module.exports = function copyAssets (options, callback) {
  var output = options.output
  var assets = options.argv.assets || 'assets'
  var pack = tar.pack(assets)
  var extract = tar.extract(path.join(output, argv.assets))
  pack.pipe(extract).on('end', callback)
}
