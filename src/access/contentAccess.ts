import type { Access, FieldAccess, Where } from 'payload'

type ContentUser = {
  id: number
  role?: 'admin' | 'editor' | 'autor' | null
} | null | undefined

const POSTS_EDITOR_ROLES: ReadonlyArray<NonNullable<NonNullable<ContentUser>['role']>> = [
  'admin',
  'editor',
  'autor',
]

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
  if (!user) return { published: { equals: true } } as Where
  if (hasElevatedContentAccess(user)) return true
  // Autor: published OR posts they own. Without this filter the role could
  // list every other autor's drafts via `GET /api/posts?where[published][equals]=false`.
  return {
    or: [
      { published: { equals: true } },
      { owner: { equals: user.id } },
    ],
  } as Where
}

export const canMutateOwnOrElevated: Access = ({ req: { user } }) => {
  if (!user) return false
  if (hasElevatedContentAccess(user)) return true
  return { owner: { equals: user.id } }
}

export const canEditPostsField: FieldAccess = ({ req: { user } }) => {
  const role = (user as ContentUser)?.role
  return Boolean(role && POSTS_EDITOR_ROLES.includes(role))
}
