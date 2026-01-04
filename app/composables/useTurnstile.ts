/**
 * Composable for Cloudflare Turnstile bot protection
 * Manages initialization, execution, and cleanup of Turnstile widget
 */
export function useTurnstile() {
  const config = useRuntimeConfig();
  const turnstileToken = ref<string | null>(null);
  const turnstileEl = ref<HTMLElement | null>(null);
  const widgetId = ref<string | null>(null);

  /**
   * Initialize Turnstile widget
   * @param onSuccess - Callback function to execute when token is received
   */
  const initializeTurnstile = (onSuccess: (token: string) => void) => {
    let retryCount = 0;
    const maxRetries = 50;

    const initTurnstile = () => {
      if ((window as any).turnstile && turnstileEl.value) {
        try {
          widgetId.value = (window as any).turnstile.render(turnstileEl.value, {
            sitekey: config.public.CF_SITE_KEY,
            size: 'invisible',
            execution: 'execute',
            callback: (token: string) => {
              turnstileToken.value = token;
              onSuccess(token);
            },
          });
        } catch (error) {
          console.error('Failed to initialize Turnstile:', error);
        }
      } else if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(initTurnstile, 100);
      } else {
        console.error('Turnstile script failed to load after maximum retries');
      }
    };

    initTurnstile();
  };

  /**
   * Execute Turnstile challenge
   */
  const executeTurnstile = () => {
    if ((window as any).turnstile && widgetId.value) {
      (window as any).turnstile.execute(widgetId.value);
    }
  };

  /**
   * Reset Turnstile widget (e.g., after failed submission)
   */
  const resetTurnstile = () => {
    if ((window as any).turnstile && widgetId.value) {
      try {
        (window as any).turnstile.reset(widgetId.value);
      } catch (_) { }
      turnstileToken.value = null;
    }
  };

  /**
   * Cleanup Turnstile widget
   */
  const cleanupTurnstile = () => {
    if ((window as any).turnstile && widgetId.value) {
      try {
        (window as any).turnstile.remove(widgetId.value);
      } catch (_) { }
    }
  };

  return {
    turnstileToken,
    turnstileEl,
    widgetId,
    initializeTurnstile,
    executeTurnstile,
    resetTurnstile,
    cleanupTurnstile,
  };
}
