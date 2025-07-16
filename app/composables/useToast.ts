interface ToastState {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  duration: number
  visible: boolean
}

interface ToastOptions {
  type?: 'success' | 'error' | 'info'
  duration?: number
}

interface UseToastResponse {
  toasts: Ref<ToastState[]>
  showToast: (message: string, options?: ToastOptions) => void
  hideToast: (id: string) => void
  clearAllToasts: () => void
}

/**
 * Toast notification system
 * Provides temporary user feedback messages with brand styling
 */
export default function useToast(): UseToastResponse {
  const toasts = useState<ToastState[]>('toasts', () => [])

  /**
   * Generate a unique ID for each toast
   */
  function generateToastId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
  }

  /**
   * Show a toast notification
   * @param message - The message to display
   * @param options - Toast configuration options
   */
  function showToast(message: string, options: ToastOptions = {}) {
    const {
      type = 'success',
      duration = 4000
    } = options

    // Clear existing toasts when showing a new one
    clearAllToasts()

    const id = generateToastId()
    
    const toast: ToastState = {
      id,
      message,
      type,
      duration,
      visible: false
    }

    // Add toast to state
    toasts.value.push(toast)

    // Show toast with slight delay for animation
    nextTick(() => {
      const toastIndex = toasts.value.findIndex(t => t.id === id)
      if (toastIndex !== -1 && toasts.value[toastIndex]) {
        toasts.value[toastIndex]!.visible = true
      }
    })

    // Auto-hide after duration
    if (duration > 0) {
      setTimeout(() => {
        hideToast(id)
      }, duration)
    }
  }

  /**
   * Hide a specific toast
   * @param id - The toast ID to hide
   */
  function hideToast(id: string) {
    const toastIndex = toasts.value.findIndex(t => t.id === id)
    if (toastIndex === -1) return

    // Hide with animation
    if (toasts.value[toastIndex]) {
      toasts.value[toastIndex]!.visible = false
    }

    // Remove from DOM after animation completes
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 300) // Match CSS transition duration
  }

  /**
   * Clear all toasts immediately
   */
  function clearAllToasts() {
    toasts.value = []
  }

  return {
    toasts,
    showToast,
    hideToast,
    clearAllToasts
  }
}