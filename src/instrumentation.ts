export async function register() {
  // Ensure this code only runs in the Node.js runtime (server-side)
  // and in environments where you want MSW active (e.g., 'development' or 'test')
  if (
    process.env.NEXT_RUNTIME === 'nodejs' &&
    process.env.NODE_ENV === 'development'
  ) {
    const { server } = await import('@/shared/mocks/server'); // Adjust path to your MSW setup
    server.listen({ onUnhandledRequest: 'bypass' });
  }
}
