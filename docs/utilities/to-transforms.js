/**
 * Convert a camelized or hyphenated string to a heading.
 * @example
 *  'getting-started' => 'Getting Started'
 *  'gettingStarted' => 'Getting Started'
 */
export function toHeading(str) {
  let charArr = []
  for (let i = 0; i <= str.length - 1; i++) {
    let currChar = str[i], prevChar = str[i - 1]
    // if converting from a camelized string (e.g. variable name) to a heading
    // we need to space out words
    if (i !== 0 && isUpperCase(currChar) &&
      !isUpperCase(prevChar)) charArr.push(' ')
    // if converting from a hyphenated string (e.g. url slug) to a heading
    // we need to capitalize beginning of words and remove hyphens
    if (currChar === '-') currChar = ''
    else if ((i === 0 && !isUpperCase(currChar)) ||
      prevChar === '-') currChar = currChar.toUpperCase()
    charArr.push(currChar)
  }
  return charArr.join('')
}

/**
 * Coverts heading to a url slug.
 * @example
 *  'Getting Started' => 'getting-started'
 */
export function toSlug(str) {
  let charArr = []
  for (let i = 0; i <= str.length - 1; i++) {
    let currChar = str[i], prevChar = str[i - 1]
    // converting from a heading to a url slug
    // we need to seperate words by a hyphen and lower case all characters
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
