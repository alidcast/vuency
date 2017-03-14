/**
 * Components to Menu
 * @param {Object} comps - exported components
 * @returns {Array} menu option objects
 */
export function compsToMenu(comps) {
  let menu = [], keys = Object.keys(comps)
  for (let i = 0; i <= keys.length - 1; i++) {
    let heading = toHeading(keys[i]), slug = toSlug(keys[i])
    menu.push({ heading, slug }) // add lesson object to menu
  }
  return menu
}

/**
 * Components to Route Params
 * @param {String} param - param to be used as object key
 * @param {Object} comps - exported components
 * @returns {Array} route params
 */
export function componentToRouteParams(query, params) {
  let routes = []
  for (let i = 0; i <= params.length - 1; i++) {
    routes.push({ [query]: params[i] })
  }
  return routes
}

export function toHeading(str) {
  let charArr = []
  for (let i = 0; i <= str.length - 1; i++) {
    let currChar = str[i], prevChar = str[i - 1]

    // if converting from a component varaible to a heading
    // we need to space out words
    if (i !== 0 && isUpperCase(currChar) &&
      !isUpperCase(prevChar)) charArr.push(' ')

    // if converting from a url slug to a heading
    // we need to capitalize beginning of words and remove hypens
    if (currChar === '-') currChar = ''
    else if ((i === 0 && !isUpperCase(currChar)) ||
      prevChar === '-') currChar = currChar.toUpperCase()

    charArr.push(currChar)
  }
  return charArr.join('')
}

export function toSlug(str) {
  let charArr = []
  for (let i = 0; i <= str.length - 1; i++) {
    let currChar = str[i], prevChar = str[i - 1]

    // converting from a component varaible to a heading
    // we need to lower case all characters and seperate words by a hypen
    if (i !== 0 && isUpperCase(currChar) &&
      !isUpperCase(prevChar)) charArr.push('-')

    charArr.push(currChar.toLowerCase())
  }
  return charArr.join('')
}

export function isUpperCase(char) {
  if (char === char.toUpperCase()) return true
  else return false
}
