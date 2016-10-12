module.exports = function (options) {
  var namespace = options.namespace
  delete options.namespace

  return {
    namespace: namespace,
    state: options,
    reducers: {},
    effects: {},
    subscriptions: []
  }
}
