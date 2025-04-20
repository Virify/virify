const PASSWORD_VALID_SYMBOLS = '!@£$%\^&*_+'

export default function getValidPassword() {
  return {
    symbols: PASSWORD_VALID_SYMBOLS,
    pattern: `.*(?=.*[0-9])(?=.*[${PASSWORD_VALID_SYMBOLS}]).*`,
    validityText: {
      patternMismatch: `Your password should contain at least 1 number and at least one of the following symbols: ${PASSWORD_VALID_SYMBOLS}`
    }
  }
}