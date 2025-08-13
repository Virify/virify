import { useWebSocket } from "@vueuse/core";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const { loggedIn } = useUserSession();

  const ws = useWebSocket(config.public.WS_BASE_URL + "/api/_ws/connection", {
    autoConnect: false,
    immediate: false,
    autoClose: false,
    autoReconnect: {
      retries: 3,
      delay: 1000,
      onFailed() {
        console.warn("Failed to reconnect WebSocket after 3 attempts.");
      },
    },
    heartbeat: {
      message: "ping",
      interval: 30000,
      pongTimeout: 5000,
    },
  });

  if (import.meta.client) {
    watch(
      () => loggedIn.value,
      (newUser) => {
        if (newUser && ws.status.value === "CLOSED") {
          ws.open();
        }
      },
      { immediate: true }
    );
  }
});
