var fs = require('fs')
var path = require('path')
var assert = require('assert')
var browserify = require('browserify')
var staticModule = require('static-module')
var through = require('through2')
var concat = require('concat-stream')

module.exports = function buildJS (options, callback) {
  var argv = options.argv
  var output = options.output
  var indexpath = path.join(options.source, 'index.js')

  function transform (filename) {
    if (/\.json$/.test(filename)) return through()
    var basedir = path.dirname(filename)

    var vars = {
      __filename: filename,
      __dirname: basedir
    }

    var sm = staticModule({
      scully: function (opts) {
        var stream = through()
        stream.push(`require('scully')(${JSON.stringify(options)}, layouts)`)
        stream.push(null)
        return stream
      }
    }, { vars: vars, varModules: { path: path } })

    return through(function (buf, enc, next) {
        sm.write(buf)
        sm.end()
        sm.pipe(concat(function (output) {
            next(null, output)
        }))
    })
  }

  var b = browserify(indexpath, { paths: [path.join(__dirname, '..', 'node_modules')] })
  b.transform(transform)
  b.transform(require('bulkify'))
  b.transform(require('sheetify/transform'))
  b.plugin(require('css-extract'), { out: path.join(output, 'bundle.css') })

  argv.minify = true
  if (argv.minify) {
    b.transform(require('envify'))
    b.transform(require('yo-yoify'))
    b.transform(require('unassertify'), { global: true })
    b.transform(require('es2020'), { global: true })
    b.transform(require('uglifyify'), { global: true })
  }

  b.bundle(function (err, src) {
    if (err) return callback(err)
    var bundlepath = path.join(output, 'bundle.js')
    fs.writeFile(bundlepath, src, callback)
  })
}
