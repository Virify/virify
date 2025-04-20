
/**
 *  Backslashes throw errors when used in input patterns, but are needed
 *  to escape other symbols. So use them in the regex and also strip
 *  them out before showing users 'valid' symbols
 */
function removeBackslash(str: string) {
  if (!isString(str)) return ''

  return str.replace(/\\/g, '')
}

/**
 *  Constants
 */
const PASSWORD_VALID_SYMBOLS = '\\-=.,!@£$%&*_+><`~:;#?\'\"\^\\/\\(\\)\\{\\}'

/**
 *  Getter
 */
export default function getValidPassword() {
  return {
    symbols: PASSWORD_VALID_SYMBOLS,
    pattern: `.*(?=.*[0-9])(?=.*[${PASSWORD_VALID_SYMBOLS}]).*`,
    validityText: {
      patternMismatch: `Your password should contain at least 1 number and at least one of the following symbols: ${removeBackslash(PASSWORD_VALID_SYMBOLS)}`
    }
  }
}