
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('pino');
    // next-logger does not have TypeScript types; we import it for its side effects only.
    // @ts-ignore
    await import('next-logger-canary');
  }
}
