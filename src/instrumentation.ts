export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { getPayload } = await import('payload')
    const { default: config } = await import('./payload.config')
    const payload = await getPayload({ config })

    if (process.env.NODE_ENV === 'production') {
      const { prodMigrations } = payload.db as { prodMigrations?: unknown[] }
      if (prodMigrations?.length) {
        await (payload.db as { migrate: (args: { migrations: unknown[] }) => Promise<void> }).migrate(
          { migrations: prodMigrations },
        )
      }
    }
  }
}
