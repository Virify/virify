export default function useTypingAnimation(originalText: string) {
  const typedText = shallowRef(' ')

  let interval: NodeJS.Timeout

  function resetText(resetText = false) {
    if (interval) clearInterval(interval)
    if (resetText) typedText.value = ''
  }

  function animateText() {
    resetText(true)

    let tickCounter = 0

    interval = setInterval(() => {
      typedText.value += originalText[tickCounter]

      tickCounter++

      if (tickCounter >= originalText.length) {
        resetText()
      }
    }, 25)
  }

  return {
    text: typedText,
    animateText,
    resetText
  }
}