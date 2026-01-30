export default function useTypingAnimation(originalText: string) {
  const typedText = shallowRef('')
  const isTyping = shallowRef(false)

  let interval: NodeJS.Timeout

  function resetText(resetText = false) {
    if (interval) clearInterval(interval)
    if (resetText) typedText.value = ''
  }

  function animateText() {
    if (typedText.value.length) return

    resetText(true)

    let tickCounter = 0

    isTyping.value = true

    interval = setInterval(() => {
      typedText.value += originalText[tickCounter]

      tickCounter++

      if (tickCounter >= originalText.length) {
        isTyping.value = false

        resetText()
      }
    }, 15)
  }

  function animateSkipToEnd() {
    resetText()

    typedText.value = originalText
    isTyping.value = false
  }

  return {
    text: typedText,
    isTyping,
    animateText,
    animateSkipToEnd,
    resetText
  }
}