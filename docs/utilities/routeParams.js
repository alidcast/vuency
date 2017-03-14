/**
 * Components to Route Params
 * @param {String} param - param to be used as object key
 * @param {Object} comps - exported components
 * @returns {Array} route params
 */
module.exports = function componentToRouteParams(query, params) {
  let routes = []
  for (let i = 0; i <= params.length - 1; i++) {
    routes.push({ [query]: params[i] })
  }
  return routes
}
