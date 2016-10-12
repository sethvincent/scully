var html = require('scully/html')
var css = require('sheetify')

module.exports = function defaultLayout (state, prev, send) {
  var pagename = state.params.page || 'home'
  var page = state.pages.items[pagename]
  var content = html`<div></div>`
  content.innerHTML = page.html

  return html`<div>
    <h1>${page.data.title}</h1>
    <div>${content}</div>
  </div>`
}
