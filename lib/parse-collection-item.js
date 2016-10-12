var assert = require('assert')
var matter = require('gray-matter')
var isDate = require('is-date-object')
var marked = require('marked')

module.exports = function parseCollectionItem (filename, content, options, callback) {
  var parsed = matter(content)
  parsed.filename = filename
  var dateString = filename.substring(0, 10)
  var date = new Date(dateString)
  parsed.date = isDate(date) && !isNaN(date) ? date : null
  parsed.html = marked(parsed.content)
  parsed.markdown = parsed.content
  callback(null, parsed)
}
