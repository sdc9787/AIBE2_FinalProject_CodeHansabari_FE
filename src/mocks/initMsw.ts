let started = false;

/**
 * Initialize MSW (Mock Service Worker) conditionally.
 * Enable by setting NEXT_PUBLIC_API_MOCKING=enabled in your env.
 */
export async function initMsw() {
  if (started) return;
  if (process.env.NEXT_PUBLIC_API_MOCKING !== "enabled") return;

  if (typeof window === "undefined") {
    // Optional: enable server-side mocking. Remove if not desired.
    const { server } = await import("./server");
    server.listen();
  } else {
    const { worker } = await import("./browser");
    await worker.start({ onUnhandledRequest: "bypass" });
  }
  started = true;
}
