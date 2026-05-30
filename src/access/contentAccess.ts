import type { Access } from 'payload'

export const canReadPublishedOrOwn: Access = ({ req: { user } }) => {
  if (!user) return { published: { equals: true } }
  if (user.role === 'admin' || user.role === 'editor') return true
  return true
}

export const canMutateOwnOrElevated: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'admin' || user.role === 'editor') return true
  return { owner: { equals: user.id } }
}
