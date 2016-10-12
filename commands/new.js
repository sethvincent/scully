var fs = require('fs')
var url = require('url')
var path = require('path')
var assert = require('assert')
var exec = require('child_process').execSync
var each = require('each-async')
var mustache = require('maxstache-stream')
var mkdirp = require('mkdirp')

module.exports = {
  name: 'new',
  command: function (argv) {
    if (argv.help) {
      return console.log('help not yet implemented')
    }

    var outputDir = process.cwd()
    var cwd = path.parse(outputDir)
    var templatesDir = path.join(__dirname, '..', 'templates')

    var files = [
      ['index.js'],
      ['config.js'],
      ['style.css'],
      ['pages', 'home.md'],
      ['layouts', 'default.js']
    ]

    var ctx = {
      title: argv.title || cwd.base,
      slug: cwd.base
    }

    mkdirp.sync(path.join(outputDir, 'pages'))
    mkdirp.sync(path.join(outputDir, 'layouts'))

    each(files, function (file, i, next) {
      var source = path.join.apply(null, [templatesDir].concat(file))
      var target = path.join.apply(null, [outputDir].concat(file))
      var stream = fs.createReadStream(source)
      stream.pipe(mustache(ctx)).pipe(fs.createWriteStream(target))
      stream.on('end', next)
    }, function (err) {
      var opts = { stdio: [ 0,1,2 ] }
      exec('npm init', opts)
      exec('npm link scully', opts)
      exec('npm i --save tachyons bulk-require browserify insert-css watchify sheetify', opts)

      var pkgPath = path.join(outputDir, 'package.json')
      var pkg = require(pkgPath)

      pkg.scripts = {
        build: 'scully build . -o dist',
        start: 'scully serve . -o dist'
      }

      fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2), function (err) {
        if (err) console.log(err)
      })
    })
  },
  options: [
    {
      name: 'title',
      boolean: false,
      default: false,
      abbr: 't'
    },
    {
      name: 'help',
      boolean: true,
      default: false,
      abbr: 'h'
    }
  ]
}
