/* required to make the app work */
var bulk = require('bulk-require')
var scully = require('scully')
var layouts = bulk('layouts', '**/*.js')
var app = scully()
/* do not edit above this line */

/* styes */
var css = require('sheetify')
css('tachyons')
css('./style.css', { global: true })

/* start the app */
app.start()
