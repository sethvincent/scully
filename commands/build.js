var fs = require('fs')
var url = require('url')
var path = require('path')
var assert = require('assert')
var apply = require('async.applyeachseries')
var parsePath = require('parse-filepath')
var minimist = require('minimist')
var bulk = require('bulk-require')
var each = require('each-async')
var extend = require('extend')
var mkdir = require('mkdirp')
var rm = require('rimraf')
var exit = require('exit')

var createApp = require('../index')
var readConfig = require('../lib/read-config')
var readData = require('../lib/read-data')
var readCollection = require('../lib/read-collection')
var createHTML = require('../lib/create-html')
var createFiles = require('../lib/create-html-files')
var createJS = require('../lib/create-js')

module.exports = {
  name: 'build',
  command: function (argv) {
    var cwd = process.cwd()
    var source = argv._[0] ? path.resolve(argv._[0]) : cwd
    var configFile

    try {
      configFile = require(path.join(source + '/config.js'))
    } catch (err) {
      configFile = {}
    }

    var config = readConfig(configFile)
    config.baseurl = config.baseurl || '/'

    readFiles(function (err, results) {
      var options = extend(results, {
        argv: argv,
        source: source,
        output: path.resolve(cwd, argv.output),
        site: config
      })

      var app = createApp(options, bulk(path.join(source, 'layouts'), '**/*.js'))

      options.toString = function toString (route, state) {
        return app.toString(route, state)
      }

      build(options)
    })

    function build (options) {
      var tasks = [
        createOutputDir,
        createHTML,
        createFiles,
        createJS
      ]

      apply(tasks, options, function (err) {
        if (err) console.log(err)
      })
    }

    function readFiles (callback) {
      var collections = {}
      var home

      each(Object.keys(config.collections), function (key, i, next) {
        var collection = config.collections[key]
        collection.dir = path.join(source, key)

        readCollection(collection, function (err, results) {
          collections[key] = extend(results.collection, collection)
          collections[key].namespace = collections[key].namespace || key
          if (results.home) home = results.home
          next()
        })
      }, function (err) {
        if (err) return callback(err)
        readData({ dir: path.join(source, 'data') }, function (err, data) {
          delete config.collections
          callback(null, {
            collections: collections,
            data: data,
            home: home
          })
        })
      })
    }

    function createOutputDir (options, callback) {
      rm(options.output, function (err) {
        if (err) return callback(err)
        mkdir(options.output, callback)
      })
    }
  },
  options: [
    {
      name: 'output',
      boolean: false,
      default: false,
      abbr: 'o'
    },
    {
      name: 'help',
      boolean: true,
      default: false,
      abbr: 'h'
    }
  ]
}
