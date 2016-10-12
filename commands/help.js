var usage = `
  USAGE:
    scully {command} [options]

  COMMANDS:
    new,       start a new site
    help,      show this help message

  NEW:
    scully new {workshop-name}

  HELP:
    scully help
`

module.exports = {
  name: 'help',
  command: function (args) {
    console.log(usage)
  },
  options: []
}
