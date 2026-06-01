import type { Access } from 'payload'

type ContentUser = {
  id: number
  role?: 'admin' | 'editor' | 'autor' | null
} | null | undefined

function normalizeOwnerValue(owner: unknown): number | null {
  if (typeof owner === 'number') {
    return owner
  }

  if (owner && typeof owner === 'object' && 'id' in owner) {
    const relationId = (owner as { id?: unknown }).id
    return typeof relationId === 'number' ? relationId : null
  }

  return null
}

export function hasElevatedContentAccess(user: ContentUser) {
  return user?.role === 'admin' || user?.role === 'editor'
}

export function resolveContentOwner({ value, originalDoc, req }: { value?: unknown; originalDoc?: { owner?: unknown } | null; req: { user?: ContentUser } }) {
  const currentOwner = normalizeOwnerValue(originalDoc?.owner)
  const requestedOwner = normalizeOwnerValue(value)
  const user = req.user

  if (!user) {
    return requestedOwner ?? currentOwner ?? null
  }

  if (hasElevatedContentAccess(user)) {
    return requestedOwner ?? currentOwner ?? user.id
  }

  return currentOwner ?? user.id
}

export const canReadPublishedOrOwn: Access = ({ req: { user } }) => {
  if (!user) return { published: { equals: true } }
  if (hasElevatedContentAccess(user)) return true
  return true
}

export const canMutateOwnOrElevated: Access = ({ req: { user } }) => {
  if (!user) return false
  if (hasElevatedContentAccess(user)) return true
  return { owner: { equals: user.id } }
}
