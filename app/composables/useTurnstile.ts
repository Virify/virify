/**
 * Composable for Cloudflare Turnstile bot protection
 * Manages initialization, execution, and cleanup of Turnstile widget
 */
export function useTurnstile() {
  const config = useRuntimeConfig();
  const turnstileToken = ref<string | null>(null);
  const turnstileEl = ref<HTMLElement | null>(null);
  const widgetId = ref<string | null>(null);
  const tokenResolver = ref<((token: string) => void) | null>(null);

  /**
   * Initialize Turnstile widget
   */
  const initializeTurnstile = () => {
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
              if (tokenResolver.value) {
                tokenResolver.value(token);
                tokenResolver.value = null;
              }
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
   * Execute Turnstile challenge and return a promise that resolves with the token
   */
  const executeTurnstile = (): Promise<string> => {
    return new Promise((resolve) => {
      tokenResolver.value = resolve;
      if ((window as any).turnstile && widgetId.value) {
        (window as any).turnstile.execute(widgetId.value);
      }
    });
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
